from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import httpx
from bson import ObjectId

from app.core.database import get_db
from app.core.security import decode_access_token
from app.schemas.user import UserResponse, GoogleLoginRequest

router = APIRouter(prefix="/api/v1/auth", tags=["Authentication"])

security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db = Depends(get_db),
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

    user = await db["users"].find_one({"email": token_data.email})

    if user is None:
        user_doc = {
            "email": token_data.email,
            "firebase_uid": getattr(token_data, "uid", None),
            "hashed_password": None,
            "role": "candidate",
            "created_at": datetime.now(timezone.utc)
        }
        result = await db["users"].insert_one(user_doc)
        user_doc["_id"] = str(result.inserted_id)
        user = user_doc
    else:
        user["_id"] = str(user["_id"])

    return user


@router.post("/google", response_model=UserResponse)
async def google_login(payload: GoogleLoginRequest, db = Depends(get_db)):
    """
    Verifies a Firebase ID token from Google Sign-In.
    Creates or updates the user record with Google profile data.
    """
    try:
        response = httpx.get(
            f"https://oauth2.googleapis.com/tokeninfo?id_token={payload.id_token}",
            timeout=10
        )
        if response.status_code != 200:
            raise HTTPException(status_code=401, detail=f"Invalid Firebase token: {response.text}")
        decoded = response.json()

    uid = decoded.get("sub") or decoded.get("uid")  # Google uses 'sub', Firebase uses 'uid'
    email = decoded.get("email")
    name = decoded.get("name")
    photo = decoded.get("picture")
    provider = "google"

    if not email:
        raise HTTPException(status_code=400, detail="Token missing email claim.")

    # Try to find by firebase_uid first, then fall back to email
    user = await db["users"].find_one({"firebase_uid": uid})
    if user is None:
        user = await db["users"].find_one({"email": email})

    now = datetime.now(timezone.utc)

    if user is None:
        # New user — create record
        user_doc = {
            "email": email,
            "full_name": name,
            "firebase_uid": uid,
            "photo_url": photo,
            "provider": provider,
            "role": "candidate",
            "last_login": now,
            "created_at": now
        }
        result = await db["users"].insert_one(user_doc)
        user_doc["_id"] = str(result.inserted_id)
        user = user_doc
    else:
        # Existing user — update profile data
        update_data = {
            "full_name": name or user.get("full_name"),
            "photo_url": photo or user.get("photo_url"),
            "firebase_uid": uid,
            "provider": provider,
            "last_login": now
        }
        await db["users"].update_one({"_id": user["_id"]}, {"$set": update_data})
        user.update(update_data)
        user["_id"] = str(user["_id"])

    return user


@router.get("/me", response_model=UserResponse)
async def read_users_me(current_user = Depends(get_current_user)):
    """Get the current authenticated user's profile."""
    return current_user
