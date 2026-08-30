# 🧠 AI Recruitment Intelligence Platform

> An end-to-end, production-grade AI-powered recruitment platform that parses resumes, analyzes ATS compatibility, matches candidates to jobs using semantic embeddings, and provides AI-driven career guidance — all through a stunning modern interface.

![Python](https://img.shields.io/badge/Python-3.9+-blue?style=flat-square&logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-0.110-009688?style=flat-square&logo=fastapi)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=flat-square&logo=tailwindcss)
![Gemini](https://img.shields.io/badge/Gemini_AI-Powered-4285F4?style=flat-square&logo=google)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 📄 **Resume Upload & Parsing** | Upload PDF/DOCX resumes → AI extracts skills, education, experience, projects, and certifications using Gemini LLM |
| 📊 **ATS Score Analyzer** | Scores resumes 0-100 on keyword optimization, formatting, action verbs, quantifiable metrics, and readability |
| 🔍 **Semantic Job Matching** | Compare resume vs JD using Gemini text-embedding-004 dense vectors and cosine similarity |
| ✍️ **AI Bullet Enhancer** | Rewrites weak bullet points into metric-driven STAR statements using GenAI |
| 🗺️ **Career Roadmap** | Generates personalized learning paths with skill gaps, phase-by-phase plans, and certifications |
| 🎤 **AI Mock Interview** | Voice-enabled interview simulator with Web Speech API + Gemini evaluation scoring |
| 👥 **Recruiter Dashboard** | Candidate leaderboard, skill heatmaps, match sorting, and shortlisting analytics |
| 💬 **RAG Chatbot** | Retrieval-Augmented Generation chatbot — ask natural language questions about candidate data |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────┐
│                 Frontend (React)            │
│   Vite + TailwindCSS + Framer Motion        │
│   8 Premium Dashboard Pages                 │
├─────────────────────────────────────────────┤
│              REST API (FastAPI)              │
│   /api/v1/resumes  /api/v1/matching         │
│   /api/v1/ai       /api/v1/recruiter        │
├─────────────────────────────────────────────┤
│            AI/ML Services Layer             │
│  Gemini LLM │ Embeddings │ ATS Engine       │
│  Semantic Matcher │ Interview Evaluator     │
├─────────────────────────────────────────────┤
│         Database (SQLite / PostgreSQL)       │
│   Users │ Resumes │ Jobs │ Applications     │
└─────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites
- Python 3.9+
- Node.js 18+
- Google Gemini API key ([Get one here](https://aistudio.google.com/app/apikey))

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/AI_resume_analyser.git
cd AI_resume_analyser
```

### 2. Backend Setup
```bash
cd backend
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Configure your API key
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY

# Start the server
uvicorn app.main:app --reload --port 8000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 4. Open the App
- **Frontend**: http://localhost:5173
- **Backend API Docs**: http://localhost:8000/docs

---

## 🐳 Docker Deployment

```bash
docker-compose up --build
```

---

## 📁 Project Structure

```
AI_resume_analyser/
├── backend/
│   ├── app/
│   │   ├── core/           # Config, database engine
│   │   ├── models/         # SQLAlchemy models (User, Resume, Job)
│   │   ├── schemas/        # Pydantic validation schemas
│   │   ├── services/       # AI pipeline services
│   │   │   ├── gemini_service.py   # Gemini LLM + embeddings
│   │   │   ├── parser.py          # PDF/DOCX extraction
│   │   │   ├── ats_analyzer.py    # ATS scoring algorithm
│   │   │   └── matcher.py         # Cosine similarity matching
│   │   ├── routes/         # REST API endpoints
│   │   └── main.py         # FastAPI entrypoint
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/     # Sidebar navigation
│   │   ├── pages/          # 8 feature pages
│   │   ├── App.jsx         # Router setup
│   │   └── main.jsx        # Entry point
│   ├── package.json
│   ├── vite.config.js
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/resumes/upload` | Upload and parse a resume (PDF/DOCX) |
| `GET`  | `/api/v1/resumes/{id}` | Get parsed resume data |
| `POST` | `/api/v1/matching/jobs` | Create a job posting |
| `POST` | `/api/v1/matching/match/{resume_id}/{job_id}` | Match resume to job |
| `POST` | `/api/v1/ai/enhance-bullet` | AI-enhance a bullet point |
| `POST` | `/api/v1/ai/career-roadmap` | Generate career learning path |
| `POST` | `/api/v1/ai/evaluate-interview` | Evaluate an interview answer |
| `GET`  | `/api/v1/recruiter/candidates` | List all candidates |
| `GET`  | `/api/v1/recruiter/leaderboard/{job_id}` | Rank candidates for a job |
| `GET`  | `/api/v1/recruiter/skill-heatmap` | Aggregated skill analytics |

---

## 🛠️ Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 18, Vite, TailwindCSS 3.4, Framer Motion, Recharts, Lucide Icons |
| **Backend** | Python, FastAPI, SQLAlchemy, Pydantic |
| **AI/ML** | Google Gemini API (LLM + Embeddings), NLP Pipeline, Cosine Similarity |
| **Database** | SQLite (dev) / PostgreSQL (prod) |
| **Deployment** | Docker, Docker Compose |

---

## 📝 License

This project is open-source and available under the [MIT License](LICENSE).

---

<p align="center">Built with ❤️ for the future of AI-powered recruitment</p>
# AI_resume_analyser🧠 AI Recruitment Intelligence Platform

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
