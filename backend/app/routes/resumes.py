from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from app.core.database import get_db
from app.core.config import settings
from app.services.parser import ResumeParser
from app.services.ats_analyzer import ATSAnalyzer
from app.services.gemini_service import GeminiService
from app.schemas.resume import ResumeResponse
from datetime import datetime
import cloudinary
import cloudinary.uploader
from bson import ObjectId

# Configure Cloudinary
cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET
)

router = APIRouter()

@router.post("/upload", response_model=ResumeResponse)
async def upload_resume(file: UploadFile = File(...), db = Depends(get_db)):
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

    # 4. Upload file to Cloudinary
    file_url = None
    try:
        if settings.CLOUDINARY_API_KEY:
            upload_result = cloudinary.uploader.upload(file_bytes, resource_type="raw", public_id=file.filename)
            file_url = upload_result.get("secure_url")
    except Exception as e:
        print(f"Cloudinary upload error: {e}")

    # 5. Save to DB
    resume_doc = {
        "user_id": "1", # Hardcoded to 1 for demo purposes if no auth
        "filename": file.filename,
        "file_url": file_url,
        "raw_text": raw_text,
        "parsed_data": parsed_data,
        "ats_score": ats_score,
        "ats_feedback": ats_feedback,
        "embedding": embedding,
        "created_at": datetime.utcnow()
    }
    
    result = await db["resumes"].insert_one(resume_doc)
    resume_doc["_id"] = str(result.inserted_id)

    return resume_doc

@router.get("/{resume_id}", response_model=ResumeResponse)
async def get_resume(resume_id: str, db = Depends(get_db)):
    try:
        resume = await db["resumes"].find_one({"_id": ObjectId(resume_id)})
        if not resume:
            raise HTTPException(status_code=404, detail="Resume not found")
        resume["_id"] = str(resume["_id"])
        return resume
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid Resume ID")
