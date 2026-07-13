from fastapi import APIRouter, Depends, Query
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from database import get_db
from dependencies import get_current_user
from schemas.search import SearchRequest
from schemas.response import error_response
import models
from services import pickup_service

router = APIRouter(prefix="/api/search", tags=["search"])


@router.post("/")
def search_pickups(
    body: SearchRequest,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    filters = body.filters.model_dump()
    # Map snake_case filter keys to the service layer's expected format
    service_filters = {
        "query": filters.get("query", ""),
        "status": filters.get("status", []),
        "categories": filters.get("categories", []),
        "date_from": filters.get("date_from"),
        "date_to": filters.get("date_to"),
        "condition": filters.get("condition", []),
        "sort_by": filters.get("sort_by", "date"),
        "sort_order": filters.get("sort_order", "desc"),
    }
    items, total = pickup_service.search_pickups(
        db, str(current_user.id), service_filters, body.page, body.limit
    )
    total_pages = (total + body.limit - 1) // body.limit

    query_term = service_filters.get("query", "").lower()
    results = []
    for item in items:
        highlights = {}
        if query_term:
            highlights["deviceName"] = query_term in item.device_name.lower()
            highlights["category"] = query_term in item.category.lower()
            highlights["address"] = query_term in item.address.lower()
            highlights["notes"] = query_term in (item.notes or "").lower()

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
            "matchHighlights": highlights,
        })

    return {
        "results": results,
        "total": total,
        "page": body.page,
        "totalPages": total_pages,
    }


@router.get("/stats")
def get_search_stats(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    stats = pickup_service.get_search_stats(db, str(current_user.id))
    return {
        "byStatus": stats["by_status"],
        "byCategory": stats["by_category"],
        "byCondition": stats["by_condition"],
        "totalPickups": stats["total_pickups"],
    }
