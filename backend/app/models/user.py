from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String, nullable=True)  # Nullable for OAuth users
    role = Column(String, default="candidate")  # candidate, recruiter
    full_name = Column(String, nullable=True)
    firebase_uid = Column(String, unique=True, nullable=True, index=True)
    photo_url = Column(String, nullable=True)
    provider = Column(String, default="email")  # email, google
    last_login = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

