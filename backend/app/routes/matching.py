from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.resume import Resume, Job, Application
from app.schemas.resume import JobCreate, JobResponse, ApplicationResponse
from app.services.gemini_service import GeminiService
from app.services.matcher import SemanticMatcher
import json

router = APIRouter()

@router.post("/jobs", response_model=JobResponse)
def create_job(job: JobCreate, db: Session = Depends(get_db)):
    # Extract skills automatically using Gemini
    parsed = GeminiService.parse_resume_to_json(job.description)
    required_skills = parsed.get("skills", [])
    
    # Generate Embedding
    embedding = GeminiService.get_embedding(job.description)

    db_job = Job(
        title=job.title,
        company=job.company,
        description=job.description,
        required_skills=required_skills,
        embedding=embedding
    )
    db.add(db_job)
    db.commit()
    db.refresh(db_job)
    return db_job

@router.post("/match/{resume_id}/{job_id}", response_model=ApplicationResponse)
def match_resume_to_job(resume_id: int, job_id: int, db: Session = Depends(get_db)):
    resume = db.query(Resume).filter(Resume.id == resume_id).first()
    job = db.query(Job).filter(Job.id == job_id).first()

    if not resume or not job:
        raise HTTPException(status_code=404, detail="Resume or Job not found")

    resume_skills = resume.parsed_data.get("skills", []) if resume.parsed_data else []
    job_skills = job.required_skills if job.required_skills else []

    match_result = SemanticMatcher.match_resume_to_job(
        resume.embedding, job.embedding, resume_skills, job_skills
    )

    app = Application(
        resume_id=resume_id,
        job_id=job_id,
        match_score=match_result["match_score"],
        match_details=match_result
    )
    db.add(app)
    db.commit()
    db.refresh(app)

    return app
