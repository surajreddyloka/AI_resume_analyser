import io
from typing import Tuple
import docx
from pypdf import PdfReader
from app.services.gemini_service import GeminiService

class ResumeParser:
    @staticmethod
    def extract_text_from_pdf(file_bytes: bytes) -> str:
        text = ""
        try:
            pdf = PdfReader(io.BytesIO(file_bytes))
            for page in pdf.pages:
                text += page.extract_text() + "\n"
        except Exception as e:
            print(f"PDF extraction error: {e}")
        return text

    @staticmethod
    def extract_text_from_docx(file_bytes: bytes) -> str:
        text = ""
        try:
            doc = docx.Document(io.BytesIO(file_bytes))
            for para in doc.paragraphs:
                text += para.text + "\n"
        except Exception as e:
            print(f"DOCX extraction error: {e}")
        return text

    @staticmethod
    def parse(file_bytes: bytes, filename: str) -> Tuple[str, dict]:
        """
        Extracts raw text and uses Gemini to structure it.
        """
        raw_text = ""
        if filename.endswith(".pdf"):
            raw_text = ResumeParser.extract_text_from_pdf(file_bytes)
        elif filename.endswith(".docx"):
            raw_text = ResumeParser.extract_text_from_docx(file_bytes)
        
        parsed_data = GeminiService.parse_resume_to_json(raw_text)
        return raw_text, parsed_data
