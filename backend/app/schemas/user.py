from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    email: str
    full_name: Optional[str] = None
    role: Optional[str] = "candidate"

class UserCreate(UserBase):
    password: str

class GoogleLoginRequest(BaseModel):
    id_token: str

class UserResponse(UserBase):
    id: int
    firebase_uid: Optional[str] = None
    photo_url: Optional[str] = None
    provider: Optional[str] = "email"
    last_login: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
