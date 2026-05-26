import numpy as np

class SemanticMatcher:
    @staticmethod
    def cosine_similarity(v1: list, v2: list) -> float:
        """Calculate cosine similarity between two vectors."""
        if not v1 or not v2:
            return 0.0
        vec1 = np.array(v1)
        vec2 = np.array(v2)
        dot_product = np.dot(vec1, vec2)
        norm1 = np.linalg.norm(vec1)
        norm2 = np.linalg.norm(vec2)
        if norm1 == 0 or norm2 == 0:
            return 0.0
        return float(dot_product / (norm1 * norm2))

    @staticmethod
    def match_resume_to_job(resume_embedding: list, job_embedding: list, resume_skills: list, job_skills: list) -> dict:
        """
        Calculates similarity and skill overlap.
        """
        # Semantic score
        semantic_score = SemanticMatcher.cosine_similarity(resume_embedding, job_embedding)
        
        # Skill overlap
        r_skills = set([s.lower() for s in resume_skills])
        j_skills = set([s.lower() for s in job_skills])
        
        matched_skills = list(r_skills.intersection(j_skills))
        missing_skills = list(j_skills.difference(r_skills))
        
        skill_score = len(matched_skills) / max(1, len(j_skills))
        
        # Combined score (70% semantic, 30% exact skill match)
        final_score = (semantic_score * 0.7) + (skill_score * 0.3)
        
        return {
            "match_score": final_score * 100, # Percentage
            "semantic_similarity": semantic_score,
            "matched_skills": matched_skills,
            "missing_skills": missing_skills
        }
