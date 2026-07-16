from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from database import get_db
from dependencies import get_current_user, require_rate_limit
from schemas.auth import RegisterRequest, LoginRequest
from schemas.response import success_response, error_response
import models
from services.auth_service import (
    hash_password,
    authenticate_user,
    create_access_token,
)
from config import get_settings

settings = get_settings()

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/register", dependencies=[Depends(require_rate_limit(3, 60))])
def register(body: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(models.User).filter(models.User.email == body.email).first()
    if existing:
        return JSONResponse(
            status_code=409,
            content=error_response("Email already registered"),
        )

    user = models.User(
        name=body.name,
        email=body.email,
        password_hash=hash_password(body.password),
        phone=body.phone,
        auth_provider=models.AuthProvider.email,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token(str(user.id))
    response = JSONResponse(
        content=success_response(
            data={"accessToken": token, "tokenType": "bearer"},
            message=None,
        )
    )
    response.set_cookie(
        key="revive_backend_token",
        value=token,
        httponly=True,
        secure=settings.ENVIRONMENT == "production",
        samesite="lax",
        max_age=60 * 60 * 24 * 7,  # 7 days
    )
    return response


@router.post("/login", dependencies=[Depends(require_rate_limit(5, 60))])
def login(body: LoginRequest, db: Session = Depends(get_db)):
    user = authenticate_user(db, body.email, body.password)
    if not user:
        return JSONResponse(
            status_code=401,
            content=error_response("Invalid email or password"),
        )
    token = create_access_token(str(user.id))
    response = JSONResponse(
        content=success_response(
            data={"accessToken": token, "tokenType": "bearer"},
            message=None,
        )
    )
    response.set_cookie(
        key="revive_backend_token",
        value=token,
        httponly=True,
        secure=settings.ENVIRONMENT == "production",
        samesite="lax",
        max_age=60 * 60 * 24 * 7,  # 7 days
    )
    return response


@router.get("/me")
def get_me(current_user: models.User = Depends(get_current_user)):
    return success_response(data={
        "id": str(current_user.id),
        "name": current_user.name,
        "email": current_user.email,
        "image": current_user.profile_picture_url,
        "isAdmin": current_user.is_admin,
    })
