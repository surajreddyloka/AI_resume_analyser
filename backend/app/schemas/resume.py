from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class ResumeBase(BaseModel):
    filename: str

class ResumeCreate(ResumeBase):
    raw_text: str

class ResumeResponse(ResumeBase):
    id: int
    user_id: int
    parsed_data: Optional[Dict[str, Any]] = None
    ats_score: Optional[float] = None
    ats_feedback: Optional[Dict[str, Any]] = None
    created_at: datetime

    class Config:
        from_attributes = True

class JobBase(BaseModel):
    title: str
    company: str
    description: str

class JobCreate(JobBase):
    pass

class JobResponse(JobBase):
    id: int
    required_skills: Optional[List[str]] = None
    created_at: datetime

    class Config:
        from_attributes = True

class ApplicationResponse(BaseModel):
    id: int
    resume_id: int
    job_id: int
    match_score: float
    match_details: Optional[Dict[str, Any]] = None
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
