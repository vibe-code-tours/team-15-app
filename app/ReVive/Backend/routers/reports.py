import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import get_db
from dependencies import get_current_user
from schemas.report import ReportCreate, ReportResponse
import models

router = APIRouter(prefix="/api/reports", tags=["reports"])


@router.post("/", response_model=ReportResponse, status_code=status.HTTP_201_CREATED)
def create_report(
    body: ReportCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # Validate target exists
    if body.target_type == "listing" and body.target_listing_id:
        target = db.query(models.Listing).filter(models.Listing.id == uuid.UUID(str(body.target_listing_id))).first()
        if not target:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Listing not found")
    elif body.target_type == "user" and body.target_user_id:
        target = db.query(models.User).filter(models.User.id == uuid.UUID(str(body.target_user_id))).first()
        if not target:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    else:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid report target")

    report = models.Report(
        reporter_id=current_user.id,
        target_listing_id=uuid.UUID(str(body.target_listing_id)) if body.target_listing_id else None,
        target_user_id=uuid.UUID(str(body.target_user_id)) if body.target_user_id else None,
        target_type=body.target_type,
        reason=body.reason,
        details=body.details,
    )
    db.add(report)
    db.commit()
    db.refresh(report)
    return report
