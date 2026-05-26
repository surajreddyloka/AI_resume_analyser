import re

class ATSAnalyzer:
    ACTION_VERBS = {"achieved", "improved", "trained", "mentored", "managed", "created", "resolved", "volunteered", "influenced", "increased", "decreased", "developed", "designed", "optimized", "spearheaded", "led"}

    @staticmethod
    def analyze(parsed_data: dict, raw_text: str) -> tuple[float, dict]:
        score = 100.0
        feedback = {
            "strengths": [],
            "weaknesses": [],
            "formatting": [],
            "metrics": []
        }

        # 1. Sections Check (20 points)
        required_sections = ["education", "experience", "skills", "projects"]
        for sec in required_sections:
            if not parsed_data.get(sec) or len(parsed_data[sec]) == 0:
                score -= 5
                feedback["formatting"].append(f"Missing or very weak {sec} section.")
            else:
                feedback["strengths"].append(f"Good {sec} section present.")

        # 2. Action Verbs Check (20 points)
        experience = parsed_data.get("experience", [])
        weak_verbs_found = False
        for exp in experience:
            for bullet in exp.get("bullets", []):
                first_word = bullet.split()[0].lower() if bullet else ""
                if first_word not in ATSAnalyzer.ACTION_VERBS:
                    weak_verbs_found = True
        
        if weak_verbs_found:
            score -= 10
            feedback["weaknesses"].append("Many bullet points do not start with strong action verbs. Use words like 'Developed', 'Managed', 'Optimized'.")

        # 3. Metrics Check (30 points)
        # Check if numbers/percentages are used in the text
        if not re.search(r'\d+%|\$\d+|\d+x', raw_text):
            score -= 15
            feedback["metrics"].append("No quantifiable metrics found. Use numbers, percentages, or dollar amounts to show impact.")
        else:
            feedback["strengths"].append("Good use of quantifiable metrics.")

        # 4. Length / Readability (30 points)
        word_count = len(raw_text.split())
        if word_count < 200:
            score -= 10
            feedback["formatting"].append("Resume is too short. Try to add more detailed project descriptions and responsibilities.")
        elif word_count > 1000:
            score -= 5
            feedback["formatting"].append("Resume might be too long. Ensure it is concise and relevant to the job.")

        return max(0.0, score), feedback
