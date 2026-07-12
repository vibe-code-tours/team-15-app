from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from schemas.category import CategoryResponse
import models

router = APIRouter(prefix="/api/categories", tags=["categories"])


@router.get("/", response_model=list[CategoryResponse])
def list_categories(db: Session = Depends(get_db)):
    return db.query(models.Category).order_by(models.Category.name).all()
