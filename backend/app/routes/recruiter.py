from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.resume import Resume, Job, Application
from app.services.matcher import SemanticMatcher
from typing import Optional

router = APIRouter()

@router.get("/candidates")
def list_candidates(
    skill: Optional[str] = Query(None, description="Filter by skill"),
    sort_by: Optional[str] = Query("ats_score", description="Sort by: ats_score or created_at"),
    db: Session = Depends(get_db)
):
    """
    Returns all candidates with their parsed data and ATS scores.
    Supports filtering by skill and sorting.
    """
    query = db.query(Resume)
    resumes = query.all()

    results = []
    for r in resumes:
        parsed = r.parsed_data or {}
        skills = [s.lower() for s in parsed.get("skills", [])]

        # Apply skill filter
        if skill and skill.lower() not in skills:
            continue

        results.append({
            "id": r.id,
            "name": parsed.get("name", "Unknown"),
            "email": parsed.get("email", "N/A"),
            "skills": parsed.get("skills", []),
            "ats_score": r.ats_score,
            "filename": r.filename,
            "created_at": str(r.created_at) if r.created_at else None,
        })

    # Sort
    if sort_by == "ats_score":
        results.sort(key=lambda x: x.get("ats_score") or 0, reverse=True)

    return {"candidates": results, "total": len(results)}


@router.get("/leaderboard/{job_id}")
def candidate_leaderboard(job_id: int, db: Session = Depends(get_db)):
    """
    Returns all candidates ranked by match score for a specific job.
    """
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        return {"error": "Job not found"}

    resumes = db.query(Resume).all()
    ranked = []

    for r in resumes:
        if not r.embedding or not job.embedding:
            continue
        resume_skills = (r.parsed_data or {}).get("skills", [])
        job_skills = job.required_skills or []
        match = SemanticMatcher.match_resume_to_job(
            r.embedding, job.embedding, resume_skills, job_skills
        )
        parsed = r.parsed_data or {}
        ranked.append({
            "resume_id": r.id,
            "name": parsed.get("name", "Unknown"),
            "match_score": round(match["match_score"], 2),
            "ats_score": r.ats_score,
            "matched_skills": match["matched_skills"],
            "missing_skills": match["missing_skills"],
        })

    ranked.sort(key=lambda x: x["match_score"], reverse=True)
    return {"job_title": job.title, "rankings": ranked}


@router.get("/skill-heatmap")
def skill_heatmap(db: Session = Depends(get_db)):
    """
    Returns aggregated skill counts across all candidates.
    """
    resumes = db.query(Resume).all()
    skill_counts = {}
    for r in resumes:
        for skill in (r.parsed_data or {}).get("skills", []):
            key = skill.strip().title()
            skill_counts[key] = skill_counts.get(key, 0) + 1

    sorted_skills = sorted(skill_counts.items(), key=lambda x: x[1], reverse=True)
    return {"skills": [{"skill": s, "count": c} for s, c in sorted_skills[:20]]}
