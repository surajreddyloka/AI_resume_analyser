import google.generativeai as genai
import json
import re
from app.core.config import settings

# Initialize Gemini API
genai.configure(api_key=settings.GEMINI_API_KEY)

# Use Gemini Flash for high speed and accuracy in text parsing and generation
model = genai.GenerativeModel('gemini-flash-latest')

def _clean_json_string(text: str) -> str:
    text = text.strip()
    text = re.sub(r"^```(?:json)?\s*", "", text, flags=re.IGNORECASE)
    text = re.sub(r"\s*```$", "", text)
    return text.strip()

class GeminiService:
    @staticmethod
    def parse_resume_to_json(raw_text: str) -> dict:
        """
        Uses Gemini to extract structured JSON data from raw resume text.
        """
        prompt = f"""
        You are an expert AI recruiter. Extract the following information from the resume text below and return ONLY a valid JSON object. Do not include markdown formatting.
        
        Required JSON structure:
        {{
            "name": "Candidate Name",
            "email": "Email address",
            "phone": "Phone number",
            "skills": ["skill 1", "skill 2", ...],
            "education": [{{"degree": "...", "institution": "...", "year": "..."}}],
            "experience": [{{"role": "...", "company": "...", "duration": "...", "bullets": ["...", "..."]}}],
            "projects": [{{"name": "...", "description": "...", "technologies": ["..."]}}],
            "certifications": ["..."]
        }}

        Resume Text:
        {raw_text}
        """
        try:
            response = model.generate_content(prompt)
            text = _clean_json_string(response.text)
            return json.loads(text)
        except Exception as e:
            print(f"JSON Parsing Error: {e}")
            return {"error": str(e), "status": "Failed to parse"}

    @staticmethod
    def extract_jd_skills(raw_text: str) -> list:
        """
        Uses Gemini to extract required skills from a job description.
        """
        prompt = f"""
        You are an expert AI recruiter. Extract ONLY the required and preferred skills, technologies, and tools mentioned in the following Job Description.
        Return ONLY a valid JSON object with a single key "skills" containing a list of strings. Do not include markdown formatting.
        
        Required JSON structure:
        {{
            "skills": ["skill 1", "skill 2", "..."]
        }}

        Job Description Text:
        {raw_text}
        """
        try:
            response = model.generate_content(prompt)
            text = _clean_json_string(response.text)
            parsed = json.loads(text)
            return parsed.get("skills", [])
        except Exception as e:
            print(f"JD Parsing Error: {e}")
            return []

    @staticmethod
    def enhance_bullet_point(bullet: str) -> dict:
        """
        Enhances a resume bullet point using the STAR method and action verbs.
        """
        prompt = f"""
        Rewrite the following resume bullet point to be more professional, impactful, and metric-driven using the STAR method (Situation, Task, Action, Result) if applicable. Start with a strong action verb.
        Return ONLY a JSON object with three variations:
        {{
            "standard": "A polished, professional version",
            "metric_driven": "A version emphasizing numbers and results (make reasonable assumptions if necessary but keep it realistic)",
            "leadership": "A version emphasizing leadership and ownership"
        }}

        Original Bullet: {bullet}
        """
        try:
            response = model.generate_content(prompt)
            text = _clean_json_string(response.text)
            return json.loads(text)
        except Exception as e:
            return {"error": str(e)}

    @staticmethod
    def generate_career_roadmap(current_skills: list, target_role: str) -> dict:
        """
        Generates a career progression roadmap.
        """
        prompt = f"""
        The user has these skills: {', '.join(current_skills)}. They want to become a {target_role}.
        Generate a learning roadmap as a JSON object with this exact structure:
        {{
            "missing_skills": ["...", "..."],
            "roadmap": [
                {{"step": 1, "title": "Phase 1: Foundations", "description": "...", "skills_to_learn": ["..."]}},
                {{"step": 2, "title": "Phase 2: Intermediate", "description": "...", "skills_to_learn": ["..."]}}
            ],
            "certifications_recommended": ["...", "..."]
        }}
        """
        try:
            response = model.generate_content(prompt)
            text = _clean_json_string(response.text)
            return json.loads(text)
        except Exception as e:
            return {"error": str(e)}

    @staticmethod
    def evaluate_interview_answer(question: str, transcript: str) -> dict:
        """
        Evaluates a candidate's verbal response to an interview question.
        """
        prompt = f"""
        You are a senior technical interviewer. Evaluate the candidate's answer to the following question.
        
        Question: {question}
        Candidate's Answer (from speech-to-text): {transcript}
        
        Provide your evaluation as a JSON object:
        {{
            "score": 8,
            "feedback": "Overall feedback...",
            "strengths": ["...", "..."],
            "improvements": ["...", "..."]
        }}
        """
        try:
            response = model.generate_content(prompt)
            text = _clean_json_string(response.text)
            return json.loads(text)
        except Exception as e:
            return {"error": str(e)}

    @staticmethod
    def answer_with_rag(query: str, context: str) -> str:
        """
        Answers a user query using the provided context (RAG).
        """
        prompt = f"""
        You are an AI Recruitment Assistant. Your job is to answer the recruiter's question based strictly on the provided candidate data below.
        If the answer is not in the candidate data, say you don't know based on the current database.
        Use Markdown formatting (bullet points, bold text) to make your answer easy to read.
        When mentioning a candidate, refer to their name and ID.

        Recruiter's Question: {query}

        Candidate Database Context:
        {context}
        """
        try:
            response = model.generate_content(prompt)
            return response.text
        except Exception as e:
            return f"Error generating answer: {str(e)}"

    @staticmethod
    def get_embedding(text: str) -> list:
        """
        Generates a dense vector embedding using Gemini API.
        """
        try:
            result = genai.embed_content(
                model="models/gemini-embedding-001",
                content=text,
                task_type="retrieval_document"
            )
            return result['embedding']
        except Exception as e:
            print(f"Embedding error: {e}")
            return []
