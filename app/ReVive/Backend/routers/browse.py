import uuid
from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from database import get_db
from dependencies import get_current_user
from schemas.response import paginated_response
import models
from services import pickup_service

router = APIRouter(prefix="/api/browse", tags=["browse"])


class BrowseFilters(BaseModel):
    query: str = ""
    categories: list[str] = []
    condition: list[str] = []
    location: str = ""
    sort_by: str = "newest"


class BrowseRequest(BaseModel):
    filters: BrowseFilters = BrowseFilters()
    page: int = Field(default=1, ge=1)
    limit: int = Field(default=12, ge=1, le=50)


@router.post("/")
def browse_available_items(
    body: BrowseRequest,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    filters = body.filters.model_dump()
    items, total = pickup_service.browse_pickups(
        db, str(current_user.id), filters, body.page, body.limit
    )
    total_pages = (total + body.limit - 1) // body.limit

    # Get donor names for all items
    donor_ids = list(set(item.user_id for item in items))
    donors = {}
    if donor_ids:
        donor_uuids = [uuid.UUID(did) for did in donor_ids]
        donor_users = db.query(models.User).filter(models.User.id.in_(donor_uuids)).all()
        donors = {str(u.id): u.name for u in donor_users}

    results = []
    for item in items:
        results.append({
            "id": item.id,
            "userId": item.user_id,
            "category": item.category,
            "deviceName": item.device_name,
            "quantity": item.quantity,
            "condition": item.condition,
            "availableFrom": item.available_from,
            "availableTo": item.available_to,
            "timeSlot": item.time_slot,
            "address": item.address,
            "notes": item.notes,
            "status": item.status,
            "createdAt": item.created_at,
            "donorName": donors.get(item.user_id, "Anonymous"),
        })

    return paginated_response(
        items=results,
        total=total,
        page=body.page,
        total_pages=total_pages,
    )
