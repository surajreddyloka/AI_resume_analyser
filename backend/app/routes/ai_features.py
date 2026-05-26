from fastapi import APIRouter
from pydantic import BaseModel
from typing import List
from app.services.gemini_service import GeminiService

router = APIRouter()

class BulletRequest(BaseModel):
    bullet: str

class RoadmapRequest(BaseModel):
    current_skills: List[str]
    target_role: str

class InterviewEvalRequest(BaseModel):
    question: str
    transcript: str

@router.post("/enhance-bullet")
def enhance_bullet(req: BulletRequest):
    return GeminiService.enhance_bullet_point(req.bullet)

@router.post("/career-roadmap")
def generate_roadmap(req: RoadmapRequest):
    return GeminiService.generate_career_roadmap(req.current_skills, req.target_role)

@router.post("/evaluate-interview")
def evaluate_interview(req: InterviewEvalRequest):
    return GeminiService.evaluate_interview_answer(req.question, req.transcript)
