🧠 AI Recruitment Intelligence Platform

An end-to-end AI-powered recruitment ecosystem that helps candidates optimize resumes, improve ATS compatibility, prepare for interviews, discover skill gaps, and intelligently match with relevant job opportunities using Generative AI and Semantic Search.

🚀 Live Demo

Frontend: https://ai-resume-analyser-suraj.netlify.app

Backend API: https://your-backend-url.com

Demo Video: https://youtube.com/your-video-link

🎯 Problem Statement

Every year, millions of candidates apply for jobs with resumes that fail ATS screening systems or don't align with recruiter expectations.

Common challenges include:

Poor ATS compatibility
Missing industry-relevant skills
Weak resume bullet points
Lack of career guidance
Poor interview preparation
Inefficient recruiter screening

As a result, qualified candidates are often rejected before reaching the interview stage.

💡 Solution

AI Recruitment Intelligence Platform leverages Large Language Models (LLMs), Resume Parsing, Semantic Search, and AI-driven evaluation systems to help candidates and recruiters make smarter hiring decisions.

The platform acts as an intelligent career assistant that:

Analyzes resumes
Generates ATS scores
Matches candidates to jobs
Improves resume quality
Creates personalized career roadmaps
Conducts AI-powered mock interviews
Provides recruiter analytics
✨ Core Features
Feature	Description
📄 Resume Parsing	Extracts education, experience, skills, projects, certifications
📊 ATS Score Analyzer	Generates ATS score (0–100) with detailed feedback
🔍 Semantic Job Matching	Uses embeddings to match resumes with job descriptions
✍️ AI Bullet Enhancer	Converts weak bullet points into impactful STAR statements
🛣️ Career Roadmap Generator	Creates personalized learning plans
🎤 AI Mock Interview	Voice-enabled interview simulation with scoring
👨‍💼 Recruiter Dashboard	Candidate ranking and recruitment analytics
📈 Skill Heatmaps	Aggregated skill analysis and insights
🏗️ System Architecture
┌────────────────────────────────────┐
│           Frontend Layer           │
│ React + Vite + TailwindCSS         │
└────────────────────────────────────┘
                 │
                 ▼
┌────────────────────────────────────┐
│            REST API Layer          │
│            FastAPI Backend         │
└────────────────────────────────────┘
                 │
                 ▼
┌────────────────────────────────────┐
│         AI Intelligence Layer      │
│ Gemini LLM                         │
│ Resume Parser                      │
│ ATS Engine                         │
│ Semantic Matcher                   │
│ Interview Evaluator                │
└────────────────────────────────────┘
                 │
                 ▼
┌────────────────────────────────────┐
│            Data Layer              │
│ SQLite / PostgreSQL                │
└────────────────────────────────────┘
🧠 AI Components
Resume Intelligence Engine
Resume Parsing
Skill Extraction
Experience Detection
Education Analysis
ATS Optimization Engine

Evaluates:

Keywords
Formatting
Action Verbs
Quantifiable Achievements
Readability
Semantic Matching Engine

Uses:

Gemini Embeddings
Cosine Similarity
Skill Relevance Scoring
Interview Evaluation Engine

Evaluates:

Communication
Technical Accuracy
Confidence
Completeness
📸 Product Screenshots
Dashboard

(Add Screenshot)

ATS Score Analysis

(Add Screenshot)

Resume Upload

(Add Screenshot)

Job Matching

(Add Screenshot)

AI Mock Interview

(Add Screenshot)

⚙️ Tech Stack
Frontend
React 18
Vite
Tailwind CSS
Framer Motion
Recharts
Backend
Python
FastAPI
SQLAlchemy
Pydantic
AI/ML
Google Gemini API
Gemini Embeddings
NLP Pipeline
Semantic Search
Database
SQLite
PostgreSQL
Deployment
Netlify
Railway
Docker
Docker Compose
🔌 API Endpoints
Method	Endpoint	Purpose
POST	/api/v1/resumes/upload	Upload Resume
GET	/api/v1/resumes/{id}	Fetch Resume
POST	/api/v1/matching/jobs	Create Job
POST	/api/v1/matching/match	Resume Matching
POST	/api/v1/ai/enhance-bullet	Improve Bullet Points
POST	/api/v1/ai/career-roadmap	Generate Roadmap
POST	/api/v1/ai/evaluate-interview	Interview Evaluation
GET	/api/v1/recruiter/candidates	Candidate Analytics
🚀 Quick Start
Clone Repository
git clone https://github.com/surajreddyloka/AI_resume_analyser.git
cd AI_resume_analyser
Backend Setup
cd backend

python -m venv venv

source venv/bin/activate

pip install -r requirements.txt

Create .env

GEMINI_API_KEY=YOUR_API_KEY
DATABASE_URL=YOUR_DATABASE_URL

Run:

uvicorn app.main:app --reload
Frontend Setup
cd frontend

npm install

npm run dev
📊 Impact
Candidate Benefits

✅ Higher ATS scores

✅ Better resume quality

✅ Improved interview readiness

✅ Personalized career guidance

Recruiter Benefits

✅ Faster screening

✅ Better candidate matching

✅ Recruitment analytics

✅ Skill intelligence insights

🔮 Future Enhancements
LinkedIn Profile Analysis
AI Cover Letter Generator
Multi-language Resume Support
Salary Prediction Engine
Company-specific Interview Preparation
Real-time Recruiter Collaboration
👨‍💻 Author

Suraj Reddy

GitHub: https://github.com/surajreddyloka

📜 License

This project is licensed under the MIT License.
