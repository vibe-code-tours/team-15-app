import uuid
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from database import get_db
from dependencies import get_current_user
from schemas.listing import ListingCreate, ListingUpdate, ListingResponse, ListingListResponse
import models

router = APIRouter(prefix="/api/listings", tags=["listings"])


@router.post("/", response_model=ListingResponse, status_code=status.HTTP_201_CREATED)
def create_listing(
    body: ListingCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    listing = models.Listing(
        owner_id=current_user.id,
        **body.model_dump(),
    )
    db.add(listing)
    db.commit()
    db.refresh(listing)
    return listing


@router.get("/", response_model=list[ListingListResponse])
def list_listings(
    region_id: str | None = None,
    category_id: str | None = None,
    status_filter: str | None = Query(None, alias="status"),
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    query = db.query(models.Listing)

    if region_id:
        query = query.filter(models.Listing.region_id == uuid.UUID(region_id))
    if category_id:
        query = query.filter(models.Listing.category_id == uuid.UUID(category_id))
    if status_filter:
        query = query.filter(models.Listing.status == status_filter)

    query = query.order_by(models.Listing.created_at.desc())
    query = query.offset((page - 1) * per_page).limit(per_page)

    return query.all()


@router.get("/{listing_id}", response_model=ListingResponse)
def get_listing(listing_id: str, db: Session = Depends(get_db)):
    listing = db.query(models.Listing).filter(models.Listing.id == uuid.UUID(listing_id)).first()
    if not listing:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Listing not found")
    return listing


@router.put("/{listing_id}", response_model=ListingResponse)
def update_listing(
    listing_id: str,
    body: ListingUpdate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    listing = db.query(models.Listing).filter(models.Listing.id == uuid.UUID(listing_id)).first()
    if not listing:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Listing not found")
    if listing.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")

    update_data = body.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(listing, field, value)
    db.commit()
    db.refresh(listing)
    return listing


@router.delete("/{listing_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_listing(
    listing_id: str,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    listing = db.query(models.Listing).filter(models.Listing.id == uuid.UUID(listing_id)).first()
    if not listing:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Listing not found")
    if listing.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")

    listing.status = models.ListingStatus.archived
    db.commit()
