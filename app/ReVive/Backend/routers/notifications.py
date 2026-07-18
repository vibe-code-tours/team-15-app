from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from database import get_db
from dependencies import get_current_user
from schemas.notification import NotificationResponse
from schemas.response import success_response
import models

router = APIRouter(prefix="/api/notifications", tags=["notifications"])


@router.get("/")
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

    results = (
        query.order_by(models.Notification.created_at.desc())
        .offset((page - 1) * per_page)
        .limit(per_page)
        .all()
    )
    
    # Manually serialize models if needed, or let FastAPI do it
    # We can just return success_response which wraps the list
    data = []
    for n in results:
        data.append({
            "id": str(n.id),
            "userId": str(n.user_id),
            "type": n.type.value if hasattr(n.type, "value") else str(n.type),
            "title": n.title,
            "message": n.message,
            "read": n.read_at is not None,
            "actionUrl": n.action_url,
            "metadata": n.payload,
            "createdAt": n.created_at.isoformat() if n.created_at else None
        })
        
    return success_response(data=data)
