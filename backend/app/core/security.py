import os
from typing import Optional
from pydantic import BaseModel
from firebase_admin import auth

class TokenData(BaseModel):
    email: Optional[str] = None
    uid: Optional[str] = None

def decode_access_token(token: str) -> TokenData:
    """Decode a Firebase ID token and return the embedded TokenData.
    Raises an exception if the token is invalid or expired.
    """
    try:
        # Verify the Firebase ID token
        decoded_token = auth.verify_id_token(token)
        uid = decoded_token.get("uid")
        email = decoded_token.get("email")
        return TokenData(email=email, uid=uid)
    except Exception as e:
        # If verification fails, raise an error
        raise ValueError(f"Invalid authentication credentials: {e}")
