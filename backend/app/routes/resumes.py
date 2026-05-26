from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.parser import ResumeParser
from app.services.ats_analyzer import ATSAnalyzer
from app.services.gemini_service import GeminiService
from app.models.resume import Resume
from app.schemas.resume import ResumeResponse

router = APIRouter()

@router.post("/upload", response_model=ResumeResponse)
async def upload_resume(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not file.filename.endswith(('.pdf', '.docx')):
        raise HTTPException(status_code=400, detail="Only PDF and DOCX files are supported.")
    
    file_bytes = await file.read()
    
    # 1. Parse Document
    raw_text, parsed_data = ResumeParser.parse(file_bytes, file.filename)
    
    if not raw_text:
        raise HTTPException(status_code=400, detail="Could not extract text from document.")

    # 2. ATS Analysis
    ats_score, ats_feedback = ATSAnalyzer.analyze(parsed_data, raw_text)

    # 3. Generate Embeddings (for matching later)
    embedding = GeminiService.get_embedding(raw_text)

    # 4. Save to DB
    db_resume = Resume(
        user_id=1, # Hardcoded to 1 for demo purposes if no auth
        filename=file.filename,
        raw_text=raw_text,
        parsed_data=parsed_data,
        ats_score=ats_score,
        ats_feedback=ats_feedback,
        embedding=embedding
    )
    db.add(db_resume)
    db.commit()
    db.refresh(db_resume)

    return db_resume

@router.get("/{resume_id}", response_model=ResumeResponse)
def get_resume(resume_id: int, db: Session = Depends(get_db)):
    resume = db.query(Resume).filter(Resume.id == resume_id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    return resume
