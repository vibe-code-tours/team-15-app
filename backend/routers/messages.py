import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import get_db
from dependencies import get_current_user
from schemas.message import MessageCreate, MessageResponse
import models

router = APIRouter(prefix="/api/messages", tags=["messages"])


@router.post("/{request_id}", response_model=MessageResponse, status_code=status.HTTP_201_CREATED)
def send_message(
    request_id: str,
    body: MessageCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    request = db.query(models.Request).filter(models.Request.id == uuid.UUID(request_id)).first()
    if not request:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Request not found")

    # Only participants (requester or listing owner) can message
    listing = db.query(models.Listing).filter(models.Listing.id == request.listing_id).first()
    if current_user.id not in (request.requester_id, listing.owner_id):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")

    message = models.Message(
        request_id=uuid.UUID(request_id),
        sender_id=current_user.id,
        body=body.body,
    )
    db.add(message)
    db.commit()
    db.refresh(message)
    return message


@router.get("/{request_id}", response_model=list[MessageResponse])
def get_messages(
    request_id: str,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    request = db.query(models.Request).filter(models.Request.id == uuid.UUID(request_id)).first()
    if not request:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Request not found")

    listing = db.query(models.Listing).filter(models.Listing.id == request.listing_id).first()
    if current_user.id not in (request.requester_id, listing.owner_id):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")

    return (
        db.query(models.Message)
        .filter(models.Message.request_id == uuid.UUID(request_id))
        .order_by(models.Message.sent_at.asc())
        .all()
    )
