import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import get_db
from dependencies import get_current_user
from schemas.request import RequestCreate, RequestUpdate, RequestResponse
import models

router = APIRouter(prefix="/api/requests", tags=["requests"])


@router.post("/", response_model=RequestResponse, status_code=status.HTTP_201_CREATED)
def create_request(
    body: RequestCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # Check listing exists and is available
    listing = db.query(models.Listing).filter(models.Listing.id == uuid.UUID(str(body.listing_id))).first()
    if not listing:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Listing not found")
    if listing.status != models.ListingStatus.available:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Listing is not available")
    if listing.owner_id == current_user.id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cannot request your own listing")

    # Check for duplicate request
    existing = (
        db.query(models.Request)
        .filter(
            models.Request.listing_id == uuid.UUID(str(body.listing_id)),
            models.Request.requester_id == current_user.id,
        )
        .first()
    )
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Request already exists")

    request = models.Request(
        listing_id=uuid.UUID(str(body.listing_id)),
        requester_id=current_user.id,
        note=body.note,
    )
    db.add(request)
    db.commit()
    db.refresh(request)
    return request


@router.get("/", response_model=list[RequestResponse])
def list_my_requests(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return (
        db.query(models.Request)
        .filter(models.Request.requester_id == current_user.id)
        .order_by(models.Request.created_at.desc())
        .all()
    )


@router.get("/listing/{listing_id}", response_model=list[RequestResponse])
def list_requests_for_listing(
    listing_id: str,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    listing = db.query(models.Listing).filter(models.Listing.id == uuid.UUID(listing_id)).first()
    if not listing:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Listing not found")
    if listing.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")

    return (
        db.query(models.Request)
        .filter(models.Request.listing_id == uuid.UUID(listing_id))
        .order_by(models.Request.created_at.desc())
        .all()
    )


@router.patch("/{request_id}", response_model=RequestResponse)
def update_request(
    request_id: str,
    body: RequestUpdate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    request = db.query(models.Request).filter(models.Request.id == uuid.UUID(request_id)).first()
    if not request:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Request not found")

    # Only the listing owner can accept/decline, only the requester can withdraw
    listing = db.query(models.Listing).filter(models.Listing.id == request.listing_id).first()
    if body.status in ("accepted", "declined") and listing.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    if body.status == "withdrawn" and request.requester_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")

    request.status = body.status
    if body.status in ("accepted", "declined"):
        from datetime import datetime, timezone
        request.responded_at = datetime.now(timezone.utc)
    if body.status == "accepted":
        from datetime import datetime, timezone
        request.confirmed_at = datetime.now(timezone.utc)
        listing.status = models.ListingStatus.reserved
    db.commit()
    db.refresh(request)
    return request
