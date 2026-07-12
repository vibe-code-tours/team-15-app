from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.responses import JSONResponse
from pydantic import Field
from sqlalchemy.orm import Session

from database import get_db
from dependencies import get_current_user
from schemas.response import success_response, error_response
import models
from services import referral_service

router = APIRouter(prefix="/api/referrals", tags=["referrals"])


@router.get("/")
def get_referral_info(
    request: Request,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    code = referral_service.get_or_create_referral_code(db, str(current_user.id))
    stats = referral_service.get_referral_stats(db, str(current_user.id))
    base_url = str(request.base_url).rstrip("/")
    return success_response(data={
        "code": code,
        "stats": {
            "totalPoints": stats["total_points"],
            "doublePointsEarned": stats["double_points_earned"],
            "referralsMade": stats["referrals_made"],
            "co2SavedFromReferrals": stats["co2_saved_from_referrals"],
            "pendingReferrals": stats["pending_referrals"],
        },
        "referralUrl": f"{base_url}/sign-up?ref={code}",
    })


@router.post("/")
def apply_referral(
    request: Request,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    import json
    import asyncio

    # Read body manually since we need raw JSON
    body = asyncio.get_event_loop().run_until_complete(request.json())
    code = body.get("code", "")

    if not code or len(code) != 8:
        return JSONResponse(
            status_code=400,
            content=error_response("Invalid referral code format"),
        )

    result = referral_service.apply_referral_code(db, code.upper(), str(current_user.id))
    if "error" in result:
        return JSONResponse(status_code=400, content=error_response(result["error"]))
    return success_response(data={"success": True}, message="Referral code applied successfully")
