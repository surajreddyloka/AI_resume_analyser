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
