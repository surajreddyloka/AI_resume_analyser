import firebase_admin
from firebase_admin import credentials

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from app.core.config import settings
from app.core.database import engine, Base

# Initialize Firebase Admin SDK
try:
    firebase_admin.get_app()
except ValueError:
    firebase_admin.initialize_app(options={'projectId': 'ai-resume-analyser-3d069'})

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Add GZip compression middleware
app.add_middleware(GZipMiddleware, minimum_size=1000)

# Set all CORS enabled origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from app.routes import auth, resumes, matching, ai_features, recruiter

app.include_router(auth.router)
app.include_router(resumes.router, prefix="/api/v1/resumes", tags=["Resumes"])
app.include_router(matching.router, prefix="/api/v1/matching", tags=["Matching"])
app.include_router(ai_features.router, prefix="/api/v1/ai", tags=["AI Features"])
app.include_router(recruiter.router, prefix="/api/v1/recruiter", tags=["Recruiter"])

@app.get("/")
def root():
    return {"message": "Welcome to AI Recruitment Platform API"}
