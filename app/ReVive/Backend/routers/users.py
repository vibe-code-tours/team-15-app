import uuid
from fastapi import APIRouter, Depends, HTTPException, Query, status
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from database import get_db
from dependencies import get_current_user
from schemas.user import UserUpdate
from schemas.response import success_response, error_response
import models
from services import user_service

router = APIRouter(prefix="/api/users", tags=["users"])


def _user_to_dict(u) -> dict:
    return {
        "id": str(u.id),
        "name": u.name,
        "email": u.email,
        "image": u.profile_picture_url,
    }


@router.get("")
def get_all_users(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    users = db.query(models.User).filter(models.User.id != current_user.id).all()
    # Don't return emails for privacy
    return success_response(data=[
        {
            "id": str(u.id),
            "name": u.name,
            "image": u.profile_picture_url,
        }
        for u in users
    ])


@router.get("/me")
def get_my_profile(current_user: models.User = Depends(get_current_user)):
    return success_response(data=_user_to_dict(current_user))


@router.put("/me")
def update_my_profile(
    body: UserUpdate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    update_data = body.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(current_user, field, value)
    db.commit()
    db.refresh(current_user)
    return success_response(data={"success": True}, message="Profile updated successfully")


@router.get("/me/stats")
def get_my_stats(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    stats = user_service.get_user_stats(db, str(current_user.id))
    return success_response(data={
        "totalPickups": stats["total_pickups"],
        "totalReferrals": stats["total_referrals"],
        "totalPoints": stats["total_points"],
    })


@router.get("/me/notifications")
def get_notification_prefs(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    prefs = user_service.get_notification_preferences(db, str(current_user.id))
    return success_response(data={
        "emailPickupUpdates": prefs["email_pickup_updates"],
        "emailReferralAlerts": prefs["email_referral_alerts"],
        "emailMilestones": prefs["email_milestones"],
        "pushEnabled": prefs["push_enabled"],
    })


@router.put("/me/notifications")
def update_notification_prefs(
    body: dict,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # Map camelCase to snake_case
    snake_prefs = {}
    mapping = {
        "emailPickupUpdates": "email_pickup_updates",
        "emailReferralAlerts": "email_referral_alerts",
        "emailMilestones": "email_milestones",
        "pushEnabled": "push_enabled",
    }
    for camel, snake in mapping.items():
        if camel in body:
            snake_prefs[snake] = body[camel]

    user_service.update_notification_preferences(db, str(current_user.id), snake_prefs)
    prefs = user_service.get_notification_preferences(db, str(current_user.id))
    return success_response(data={
        "emailPickupUpdates": prefs["email_pickup_updates"],
        "emailReferralAlerts": prefs["email_referral_alerts"],
        "emailMilestones": prefs["email_milestones"],
        "pushEnabled": prefs["push_enabled"],
    })


@router.get("/me/export")
def export_my_data(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    data = user_service.export_user_data(db, str(current_user.id))
    return success_response(data=data)


@router.delete("/me")
def delete_my_account(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    user_service.delete_user_data(db, str(current_user.id))
    return success_response(data={"success": True}, message="Account deleted")


@router.get("/{user_id}")
def get_user(user_id: str, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == uuid.UUID(user_id)).first()
    if not user:
        return JSONResponse(status_code=404, content=error_response("User not found"))
    return success_response(data=_user_to_dict(user))
