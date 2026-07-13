from fastapi import APIRouter, Depends, HTTPException, Query, status
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from database import get_db
from dependencies import get_current_user
from schemas.pickup import PickupCreate, PickupAction
from schemas.response import success_response, error_response, paginated_response
import models
from services import pickup_service, referral_service

router = APIRouter(prefix="/api/pickups", tags=["pickups"])


def _pickup_to_dict(p) -> dict:
    return {
        "id": p.id,
        "userId": p.user_id,
        "category": p.category,
        "deviceName": p.device_name,
        "quantity": p.quantity,
        "condition": p.condition,
        "availableFrom": p.available_from,
        "availableTo": p.available_to,
        "timeSlot": p.time_slot,
        "address": p.address,
        "notes": p.notes,
        "status": p.status,
        "createdAt": p.created_at,
    }


@router.get("/")
def list_my_pickups(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=50),
    status_filter: str | None = Query(None, alias="status"),
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    pickups = pickup_service.get_user_pickups(db, str(current_user.id))
    if status_filter:
        pickups = [p for p in pickups if p.status == status_filter]
    total = len(pickups)
    offset = (page - 1) * limit
    paginated = pickups[offset: offset + limit]
    total_pages = (total + limit - 1) // limit if limit > 0 else 1
    return paginated_response(
        items=[_pickup_to_dict(p) for p in paginated],
        total=total,
        page=page,
        total_pages=total_pages,
    )


@router.get("/requested")
def list_requested_pickups(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get pickups that the user has requested from other donors."""
    pickups = pickup_service.get_requested_pickups(db, str(current_user.id))
    return success_response(
        data=[_pickup_to_dict(p) for p in pickups],
    )


@router.get("/donor-requests")
def list_donor_requests(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get pickups where other users have made requests (donor view)."""
    results = pickup_service.get_donor_requests(db, str(current_user.id))
    data = []
    for item in results:
        pickup_dict = _pickup_to_dict(item["pickup"])
        requester = item["requester"]
        pickup_dict["requester"] = {
            "id": str(requester.id) if requester else None,
            "name": requester.name if requester else "Unknown",
            "email": requester.email if requester else "",
        } if requester else None
        data.append(pickup_dict)
    return success_response(data=data)


@router.post("/")
def create_pickup(
    body: PickupCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    pickup = pickup_service.create_pickup(db, str(current_user.id), body.model_dump())
    return success_response(data=_pickup_to_dict(pickup), message="Item listed successfully")


@router.get("/{pickup_id}")
def get_pickup(
    pickup_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    pickup = db.query(models.Pickup).filter(models.Pickup.id == pickup_id).first()
    if not pickup:
        return JSONResponse(status_code=404, content=error_response("Pickup not found"))
    if str(pickup.user_id) != str(current_user.id):
        return JSONResponse(status_code=403, content=error_response("Not authorized"))
    return success_response(data=_pickup_to_dict(pickup))


@router.patch("/{pickup_id}")
def update_pickup(
    pickup_id: int,
    body: PickupAction,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if body.action == "complete":
        pickup = pickup_service.complete_pickup(db, pickup_id, str(current_user.id))
        if not pickup:
            return JSONResponse(status_code=404, content=error_response("Pickup not found"))
        referral_service.award_impact_points(db, str(current_user.id), pickup_id)
        return success_response(data={"success": True}, message="Item picked up")
    elif body.action == "cancel":
        success = pickup_service.cancel_pickup(db, pickup_id, str(current_user.id))
        if not success:
            return JSONResponse(status_code=404, content=error_response("Pickup not found"))
        return success_response(data={"success": True}, message="Listing cancelled")
    elif body.action == "request":
        pickup = pickup_service.request_pickup(db, pickup_id, str(current_user.id))
        if not pickup:
            return JSONResponse(status_code=404, content=error_response("Pickup not found or already requested"))
        return success_response(data={"success": True}, message="Request sent successfully")
    elif body.action == "accept":
        pickup = pickup_service.accept_request(db, pickup_id, str(current_user.id))
        if not pickup:
            return JSONResponse(status_code=404, content=error_response("Pickup not found or not in requested state"))
        return success_response(data={"success": True}, message="Request accepted")
    elif body.action == "reject":
        pickup = pickup_service.reject_request(db, pickup_id, str(current_user.id))
        if not pickup:
            return JSONResponse(status_code=404, content=error_response("Pickup not found or not in requested state"))
        return success_response(data={"success": True}, message="Request rejected")
    else:
        return JSONResponse(
            status_code=400,
            content=error_response("Invalid action. Use 'complete', 'cancel', 'request', 'accept', or 'reject'"),
        )


@router.delete("/{pickup_id}")
def delete_pickup(
    pickup_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    success = pickup_service.delete_pickup(db, pickup_id, str(current_user.id))
    if not success:
        return JSONResponse(status_code=404, content=error_response("Pickup not found"))
    return success_response(data={"success": True}, message="Listing deleted")
