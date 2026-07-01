import os
import json
import httpx
from typing import Optional
from pydantic import BaseModel

class TokenData(BaseModel):
    email: Optional[str] = None
    uid: Optional[str] = None

def decode_access_token(token: str) -> TokenData:
    """
    Verify a Firebase ID token by calling Google's tokeninfo endpoint.
    This works without Google Application Default Credentials on the server.
    """
    try:
        url = f"https://oauth2.googleapis.com/tokeninfo?id_token={token}"
        response = httpx.get(url, timeout=10)
        if response.status_code != 200:
            # Fallback: Try Firebase token verification endpoint
            raise ValueError(f"Token verification failed: {response.text}")
        
        claims = response.json()
        email = claims.get("email")
        uid = claims.get("sub")  # Firebase UID is in the 'sub' claim
        return TokenData(email=email, uid=uid)
    except httpx.RequestError as e:
        raise ValueError(f"Network error verifying token: {e}")
    except Exception as e:
        raise ValueError(f"Invalid authentication credentials: {e}")
