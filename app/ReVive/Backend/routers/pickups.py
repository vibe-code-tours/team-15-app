import json
from fastapi import APIRouter, Depends, HTTPException, Query, status, BackgroundTasks
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from database import get_db
from dependencies import get_current_user, require_rate_limit
from schemas.pickup import PickupCreate, PickupAction
from schemas.response import success_response, error_response, paginated_response
import models
from services import pickup_service, referral_service
from services.websocket import websocket_manager
import uuid

router = APIRouter(prefix="/api/pickups", tags=["pickups"])


def _pickup_to_dict(p, requests=None) -> dict:
    """Convert a Pickup model to a dict, optionally including requests."""
    # Parse images JSON string to list
    images = None
    if p.images:
        try:
            images = json.loads(p.images)
        except (json.JSONDecodeError, TypeError):
            images = None

    result = {
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
        "images": images,
        "status": p.status,
        "createdAt": p.created_at,
    }

    if requests is not None:
        result["requests"] = requests

    return result


def _request_to_dict(req, requester=None) -> dict:
    """Convert a PickupRequest model to a dict."""
    result = {
        "id": req.id,
        "pickupId": req.pickup_id,
        "requesterId": req.requester_id,
        "pickupFrom": req.pickup_from,
        "pickupTo": req.pickup_to,
        "timeSlot": req.time_slot,
        "status": req.status,
        "createdAt": req.created_at,
    }
    if requester:
        result["requester"] = {
            "id": str(requester.id),
            "name": requester.name,
            "email": requester.email,
        }
    return result


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

    # Fetch requests for each pickup
    items = []
    for p in paginated:
        reqs = (
            db.query(models.PickupRequest)
            .filter(models.PickupRequest.pickup_id == p.id)
            .order_by(models.PickupRequest.created_at.desc())
            .all()
        )
        request_dicts = []
        for req in reqs:
            requester = db.query(models.User).filter(models.User.id == req.requester_id).first()
            request_dicts.append(_request_to_dict(req, requester=requester))
        items.append(_pickup_to_dict(p, requests=request_dicts))

    total_pages = (total + limit - 1) // limit if limit > 0 else 1
    return paginated_response(
        items=items,
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
    results = pickup_service.get_requested_pickups(db, str(current_user.id))
    data = []
    for item in results:
        pickup_dict = _pickup_to_dict(item["pickup"])
        pickup_dict["request"] = _request_to_dict(item["request"])
        data.append(pickup_dict)
    return success_response(data=data)


@router.get("/donor-requests")
def list_donor_requests(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get pickups where other users have made requests (donor view with all requests)."""
    results = pickup_service.get_donor_requests(db, str(current_user.id))
    data = []
    for item in results:
        pickup_dict = _pickup_to_dict(item["pickup"])
        request_list = []
        for req_item in item["requests"]:
            requester = req_item["requester"]
            req_dict = _request_to_dict(req_item["request"], requester=requester)
            request_list.append(req_dict)
        pickup_dict["requests"] = request_list
        data.append(pickup_dict)
    return success_response(data=data)


@router.post("/", dependencies=[Depends(require_rate_limit(20, 60))])
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
    background_tasks: BackgroundTasks,
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
        request = pickup_service.request_pickup(
            db,
            pickup_id,
            str(current_user.id),
            pickup_from=body.pickup_from,
            pickup_to=body.pickup_to,
            time_slot=body.time_slot,
        )
        if not request:
            return JSONResponse(status_code=404, content=error_response("Pickup not found, already requested, or not available"))
            
        # Get donor unread count and schedule websocket push
        pickup = db.query(models.Pickup).filter(models.Pickup.id == pickup_id).first()
        if pickup:
            unread_count = db.query(models.notifications.Notification).filter(
                models.notifications.Notification.user_id == pickup.user_id,
                models.notifications.Notification.read_at == None
            ).count()
            background_tasks.add_task(
                websocket_manager.send_personal_message,
                {"type": "notification", "unread_count": unread_count},
                uuid.UUID(str(pickup.user_id))
            )
            
        return success_response(data={"success": True}, message="Request sent successfully")
    elif body.action == "accept":
        if not body.request_id:
            return JSONResponse(status_code=400, content=error_response("requestId is required for accept action"))
        pickup = pickup_service.accept_request(db, pickup_id, str(current_user.id), body.request_id)
        if not pickup:
            return JSONResponse(status_code=404, content=error_response("Pickup or request not found"))
        return success_response(data={"success": True}, message="Request accepted")
    elif body.action == "reject":
        if not body.request_id:
            return JSONResponse(status_code=400, content=error_response("requestId is required for reject action"))
        pickup = pickup_service.reject_request(db, pickup_id, str(current_user.id), body.request_id)
        if not pickup:
            return JSONResponse(status_code=404, content=error_response("Pickup or request not found"))
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
