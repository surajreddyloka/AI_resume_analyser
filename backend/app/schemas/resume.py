from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

class ResumeBase(BaseModel):
    filename: str

class ResumeCreate(ResumeBase):
    raw_text: str

class ResumeResponse(ResumeBase):
    id: str = Field(alias="_id")
    user_id: str
    file_url: Optional[str] = None
    parsed_data: Optional[Dict[str, Any]] = None
    ats_score: Optional[float] = None
    ats_feedback: Optional[Dict[str, Any]] = None
    created_at: datetime

    class Config:
        populate_by_name = True
        from_attributes = True

class JobBase(BaseModel):
    title: str
    company: str
    description: str

class JobCreate(JobBase):
    pass

class JobResponse(JobBase):
    id: str = Field(alias="_id")
    required_skills: Optional[List[str]] = None
    created_at: datetime

    class Config:
        populate_by_name = True
        from_attributes = True

class ApplicationResponse(BaseModel):
    id: str = Field(alias="_id")
    resume_id: str
    job_id: str
    match_score: float
    match_details: Optional[Dict[str, Any]] = None
    status: str
    created_at: datetime

    class Config:
        populate_by_name = True
        from_attributes = True
