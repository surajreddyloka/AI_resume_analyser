from fastapi import APIRouter, Depends, HTTPException
from app.core.database import get_db
from app.schemas.resume import JobCreate, JobResponse, ApplicationResponse
from app.services.gemini_service import GeminiService
from app.services.matcher import SemanticMatcher
from datetime import datetime
from bson import ObjectId

router = APIRouter()

@router.post("/jobs", response_model=JobResponse)
async def create_job(job: JobCreate, db = Depends(get_db)):
    # Extract skills automatically using Gemini
    parsed = GeminiService.parse_resume_to_json(job.description)
    required_skills = parsed.get("skills", [])
    
    # Generate Embedding
    embedding = GeminiService.get_embedding(job.description)

    job_doc = {
        "title": job.title,
        "company": job.company,
        "description": job.description,
        "required_skills": required_skills,
        "embedding": embedding,
        "created_at": datetime.utcnow()
    }
    
    result = await db["jobs"].insert_one(job_doc)
    job_doc["_id"] = str(result.inserted_id)

    return job_doc

@router.post("/match/{resume_id}/{job_id}", response_model=ApplicationResponse)
async def match_resume_to_job(resume_id: str, job_id: str, db = Depends(get_db)):
    try:
        resume = await db["resumes"].find_one({"_id": ObjectId(resume_id)})
        job = await db["jobs"].find_one({"_id": ObjectId(job_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid ID format")

    if not resume or not job:
        raise HTTPException(status_code=404, detail="Resume or Job not found")

    resume_skills = resume.get("parsed_data", {}).get("skills", []) if resume.get("parsed_data") else []
    job_skills = job.get("required_skills", [])

    match_result = SemanticMatcher.match_resume_to_job(
        resume.get("embedding"), job.get("embedding"), resume_skills, job_skills
    )

    app_doc = {
        "resume_id": str(resume["_id"]),
        "job_id": str(job["_id"]),
        "match_score": match_result["match_score"],
        "match_details": match_result,
        "status": "applied",
        "created_at": datetime.utcnow()
    }
    
    result = await db["applications"].insert_one(app_doc)
    app_doc["_id"] = str(result.inserted_id)

    return app_doc
