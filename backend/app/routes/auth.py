from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from firebase_admin import auth as firebase_auth

from app.core.database import get_db
from app.core.security import decode_access_token
from app.models.user import User
from app.schemas.user import UserResponse, GoogleLoginRequest

router = APIRouter(prefix="/api/v1/auth", tags=["Authentication"])

security = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
):
    """Validates the Firebase ID token and returns the user from the database."""
    token = credentials.credentials
    try:
        token_data = decode_access_token(token)
        if token_data.email is None:
            raise ValueError("Token does not contain an email")
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
            headers={"WWW-Authenticate": "Bearer"},
        )

    user = db.query(User).filter(User.email == token_data.email).first()

    if user is None:
        user = User(
            email=token_data.email,
            firebase_uid=token_data.uid,
            hashed_password=None,
            role="candidate",
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    return user


@router.post("/google", response_model=UserResponse)
def google_login(payload: GoogleLoginRequest, db: Session = Depends(get_db)):
    """
    Verifies a Firebase ID token from Google Sign-In.
    Creates or updates the user record with Google profile data.
    """
    try:
        decoded = firebase_auth.verify_id_token(payload.id_token)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid Firebase token: {e}",
        )

    uid = decoded.get("uid")
    email = decoded.get("email")
    name = decoded.get("name")
    photo = decoded.get("picture")
    provider = "google"

    if not email:
        raise HTTPException(status_code=400, detail="Token missing email claim.")

    # Try to find by firebase_uid first, then fall back to email
    user = db.query(User).filter(User.firebase_uid == uid).first()
    if user is None:
        user = db.query(User).filter(User.email == email).first()

    now = datetime.now(timezone.utc)

    if user is None:
        # New user — create record
        user = User(
            email=email,
            full_name=name,
            firebase_uid=uid,
            photo_url=photo,
            provider=provider,
            role="candidate",
            last_login=now,
        )
        db.add(user)
    else:
        # Existing user — update profile data
        user.full_name = name or user.full_name
        user.photo_url = photo or user.photo_url
        user.firebase_uid = uid
        user.provider = provider
        user.last_login = now

    db.commit()
    db.refresh(user)
    return user


@router.get("/me", response_model=UserResponse)
def read_users_me(current_user: User = Depends(get_current_user)):
    """Get the current authenticated user's profile."""
    return current_user
