from fastapi import APIRouter, Depends, Query, HTTPException
from app.core.database import get_db
from app.services.matcher import SemanticMatcher
from typing import Optional
from bson import ObjectId

router = APIRouter()

@router.get("/candidates")
async def list_candidates(
    skill: Optional[str] = Query(None, description="Filter by skill"),
    sort_by: Optional[str] = Query("ats_score", description="Sort by: ats_score or created_at"),
    db = Depends(get_db)
):
    """
    Returns all candidates with their parsed data and ATS scores.
    Supports filtering by skill and sorting.
    """
    resumes = await db["resumes"].find({}).to_list(length=1000)

    results = []
    for r in resumes:
        parsed = r.get("parsed_data") or {}
        skills = [s.lower() for s in parsed.get("skills", [])]

        # Apply skill filter
        if skill and skill.lower() not in skills:
            continue

        results.append({
            "id": str(r["_id"]),
            "name": parsed.get("name", "Unknown"),
            "email": parsed.get("email", "N/A"),
            "skills": parsed.get("skills", []),
            "ats_score": r.get("ats_score"),
            "filename": r.get("filename"),
            "created_at": str(r.get("created_at")) if r.get("created_at") else None,
        })

    # Sort
    if sort_by == "ats_score":
        results.sort(key=lambda x: x.get("ats_score") or 0, reverse=True)

    return {"candidates": results, "total": len(results)}


@router.get("/leaderboard/{job_id}")
async def candidate_leaderboard(job_id: str, db = Depends(get_db)):
    """
    Returns all candidates ranked by match score for a specific job.
    """
    try:
        job = await db["jobs"].find_one({"_id": ObjectId(job_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid job ID format")
        
    if not job:
        return {"error": "Job not found"}

    resumes = await db["resumes"].find({}).to_list(length=1000)
    ranked = []

    for r in resumes:
        if not r.get("embedding") or not job.get("embedding"):
            continue
        resume_skills = (r.get("parsed_data") or {}).get("skills", [])
        job_skills = job.get("required_skills") or []
        match = SemanticMatcher.match_resume_to_job(
            r.get("embedding"), job.get("embedding"), resume_skills, job_skills
        )
        parsed = r.get("parsed_data") or {}
        ranked.append({
            "resume_id": str(r["_id"]),
            "name": parsed.get("name", "Unknown"),
            "match_score": round(match["match_score"], 2),
            "ats_score": r.get("ats_score"),
            "matched_skills": match["matched_skills"],
            "missing_skills": match["missing_skills"],
        })

    ranked.sort(key=lambda x: x["match_score"], reverse=True)
    return {"job_title": job.get("title"), "rankings": ranked}


@router.get("/skill-heatmap")
async def skill_heatmap(db = Depends(get_db)):
    """
    Returns aggregated skill counts across all candidates.
    """
    resumes = await db["resumes"].find({}).to_list(length=1000)
    skill_counts = {}
    for r in resumes:
        for skill in (r.get("parsed_data") or {}).get("skills", []):
            key = skill.strip().title()
            skill_counts[key] = skill_counts.get(key, 0) + 1

    sorted_skills = sorted(skill_counts.items(), key=lambda x: x[1], reverse=True)
    return {"skills": [{"skill": s, "count": c} for s, c in sorted_skills[:20]]}
