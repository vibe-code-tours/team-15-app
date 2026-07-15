import uuid
from fastapi import APIRouter, Depends, HTTPException, Query, status
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database import get_db
from dependencies import get_current_user
from schemas.response import success_response, error_response
import models
from services import admin_service

router = APIRouter(prefix="/api/admin", tags=["admin"])

def get_admin_user(current_user: models.User = Depends(get_current_user)) -> models.User:
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin privileges required"
        )
    return current_user

class AdminActionRequest(BaseModel):
    action: str
    target_user_id: str | None = None
    target_listing_id: str | None = None
    reason: str | None = None
    suspension_days: int | None = None


@router.get("/stats")
def get_admin_stats(
    current_user: models.User = Depends(get_admin_user),
    db: Session = Depends(get_db),
):
    stats = admin_service.get_admin_stats(db)
    # Convert to camelCase
    return success_response(data={
        "totalPickups": stats["total_pickups"],
        "completedPickups": stats["completed_pickups"],
        "activeUsers": stats["active_users"],
        "totalItems": stats["total_items"],
        "totalCo2Saved": stats["total_co2_saved"],
        "recentPickups": [
            {
                "id": p["id"],
                "deviceName": p["device_name"],
                "category": p["category"],
                "status": p["status"],
                "createdAt": p["created_at"],
                "userName": p["user_name"],
            }
            for p in stats["recent_pickups"]
        ],
    })


@router.get("/pickups")
def list_all_pickups(
    current_user: models.User = Depends(get_admin_user),
    db: Session = Depends(get_db),
):
    pickups = admin_service.get_all_pickups(db)
    return [
        {
            "id": p["id"],
            "userId": p["user_id"],
            "category": p["category"],
            "deviceName": p["device_name"],
            "quantity": p["quantity"],
            "condition": p["condition"],
            "availableFrom": p["available_from"],
            "availableTo": p["available_to"],
            "timeSlot": p["time_slot"],
            "address": p["address"],
            "notes": p["notes"],
            "status": p["status"],
            "createdAt": p["created_at"],
            "userName": p["user_name"],
            "userEmail": p["user_email"],
        }
        for p in pickups
    ]


@router.get("/users")
def list_all_users(
    current_user: models.User = Depends(get_admin_user),
    db: Session = Depends(get_db),
):
    users = admin_service.get_all_users(db)
    return [
        {
            "id": u["id"],
            "name": u["name"],
            "email": u["email"],
            "createdAt": u["created_at"],
            "pickupCount": u["pickup_count"],
            "totalPoints": u["total_points"],
        }
        for u in users
    ]


@router.get("/breakdown/categories")
def get_category_breakdown(
    current_user: models.User = Depends(get_admin_user),
    db: Session = Depends(get_db),
):
    breakdown = admin_service.get_category_breakdown(db)
    return [{"label": b["label"], "count": b["count"]} for b in breakdown]


@router.get("/breakdown/status")
def get_status_breakdown(
    current_user: models.User = Depends(get_admin_user),
    db: Session = Depends(get_db),
):
    breakdown = admin_service.get_status_breakdown(db)
    return [{"label": b["label"], "count": b["count"]} for b in breakdown]


# --- Reports & Actions ---

@router.get("/reports")
def list_reports(
    status_filter: str | None = Query(None, alias="status"),
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    current_user: models.User = Depends(get_admin_user),
    db: Session = Depends(get_db),
):
    query = db.query(models.Report)
    if status_filter:
        query = query.filter(models.Report.status == status_filter)
    reports = (
        query.order_by(models.Report.created_at.desc())
        .offset((page - 1) * per_page)
        .limit(per_page)
        .all()
    )
    return [
        {
            "id": str(r.id),
            "reporterId": str(r.reporter_id),
            "targetType": r.target_type,
            "targetListingId": str(r.target_listing_id) if r.target_listing_id else None,
            "targetUserId": str(r.target_user_id) if r.target_user_id else None,
            "reason": r.reason,
            "details": r.details,
            "status": r.status,
            "createdAt": str(r.created_at) if r.created_at else None,
        }
        for r in reports
    ]


@router.patch("/reports/{report_id}")
def update_report_status(
    report_id: str,
    status_update: str,
    current_user: models.User = Depends(get_admin_user),
    db: Session = Depends(get_db),
):
    report = db.query(models.Report).filter(models.Report.id == uuid.UUID(report_id)).first()
    if not report:
        return JSONResponse(status_code=404, content=error_response("Report not found"))
    report.status = status_update
    db.commit()
    db.refresh(report)
    return {
        "id": str(report.id),
        "reporterId": str(report.reporter_id),
        "targetType": report.target_type,
        "targetListingId": str(report.target_listing_id) if report.target_listing_id else None,
        "targetUserId": str(report.target_user_id) if report.target_user_id else None,
        "reason": report.reason,
        "details": report.details,
        "status": report.status,
        "createdAt": str(report.created_at) if report.created_at else None,
    }


@router.post("/actions")
def take_action(
    body: AdminActionRequest,
    current_user: models.User = Depends(get_admin_user),
    db: Session = Depends(get_db),
):
    from datetime import datetime, timedelta, timezone

    action = models.AdminAction(
        admin_id=current_user.id,
        action=body.action,
        target_user_id=uuid.UUID(body.target_user_id) if body.target_user_id else None,
        target_listing_id=uuid.UUID(body.target_listing_id) if body.target_listing_id else None,
        reason=body.reason,
    )

    if body.action == "suspend" and body.suspension_days and body.target_user_id:
        action.suspension_ends_at = datetime.now(timezone.utc) + timedelta(days=body.suspension_days)
        user = db.query(models.User).filter(models.User.id == uuid.UUID(body.target_user_id)).first()
        if user:
            user.status = models.UserStatus.suspended

    if body.action == "ban" and body.target_user_id:
        user = db.query(models.User).filter(models.User.id == uuid.UUID(body.target_user_id)).first()
        if user:
            user.status = models.UserStatus.banned

    if body.action == "takedown" and body.target_listing_id:
        listing = db.query(models.Listing).filter(models.Listing.id == uuid.UUID(body.target_listing_id)).first()
        if listing:
            listing.status = models.ListingStatus.archived

    db.add(action)
    db.commit()
    return {"detail": "Action recorded"}
