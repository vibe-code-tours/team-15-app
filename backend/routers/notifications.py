from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from database import get_db
from dependencies import get_current_user
from schemas.notification import NotificationResponse
import models

router = APIRouter(prefix="/api/notifications", tags=["notifications"])


@router.get("/", response_model=list[NotificationResponse])
def list_notifications(
    unread_only: bool = False,
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    query = db.query(models.Notification).filter(
        models.Notification.user_id == current_user.id
    )
    if unread_only:
        query = query.filter(models.Notification.read_at.is_(None))

    return (
        query.order_by(models.Notification.created_at.desc())
        .offset((page - 1) * per_page)
        .limit(per_page)
        .all()
    )
