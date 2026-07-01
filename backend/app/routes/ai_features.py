from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import List
from app.services.gemini_service import GeminiService
from app.core.database import get_db

router = APIRouter()

class BulletRequest(BaseModel):
    bullet: str

class RoadmapRequest(BaseModel):
    current_skills: List[str]
    target_role: str

class InterviewEvalRequest(BaseModel):
    question: str
    transcript: str

class ChatbotRequest(BaseModel):
    query: str

@router.post("/enhance-bullet")
def enhance_bullet(req: BulletRequest):
    return GeminiService.enhance_bullet_point(req.bullet)

@router.post("/career-roadmap")
def generate_roadmap(req: RoadmapRequest):
    return GeminiService.generate_career_roadmap(req.current_skills, req.target_role)

@router.post("/evaluate-interview")
def evaluate_interview(req: InterviewEvalRequest):
    return GeminiService.evaluate_interview_answer(req.question, req.transcript)

@router.post("/chatbot")
async def chatbot(req: ChatbotRequest, db = Depends(get_db)):
    # 1. Fetch some candidates from the DB for context (in a real app, you'd do vector search here)
    # Since this is a simple prototype, we'll just fetch recent resumes
    resumes = await db["resumes"].find({}).sort("created_at", -1).limit(10).to_list(10)
    
    # 2. Format context
    context_lines = []
    for r in resumes:
        parsed = r.get("parsed_data", {})
        context_lines.append(
            f"- Name: {parsed.get('name', 'Unknown')}, "
            f"Skills: {', '.join(parsed.get('skills', []))}, "
            f"Experience: {len(parsed.get('experience', []))} roles, "
            f"ATS Score: {r.get('ats_score', 'N/A')}"
        )
    context = "\n".join(context_lines)
    
    # 3. Ask Gemini
    answer = GeminiService.answer_with_rag(req.query, context)
    return {"answer": answer}
