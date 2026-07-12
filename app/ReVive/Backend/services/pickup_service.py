from datetime import datetime, timezone
from sqlalchemy.orm import Session
import models


def get_user_pickups(db: Session, user_id: str) -> list[models.Pickup]:
    return (
        db.query(models.Pickup)
        .filter(models.Pickup.user_id == user_id)
        .order_by(models.Pickup.created_at.desc())
        .all()
    )


def create_pickup(db: Session, user_id: str, data: dict) -> models.Pickup:
    pickup = models.Pickup(
        user_id=user_id,
        category=data["category"],
        device_name=data["device_name"].strip(),
        quantity=max(1, data.get("quantity", 1)),
        condition=data.get("condition", "working"),
        pickup_date=data["pickup_date"],
        time_slot=data["time_slot"],
        address=data["address"].strip(),
        notes=data.get("notes", "").strip() if data.get("notes") else None,
        status="available",
        created_at=datetime.now(timezone.utc).isoformat(),
    )
    db.add(pickup)
    db.commit()
    db.refresh(pickup)
    return pickup


def complete_pickup(db: Session, pickup_id: int, user_id: str) -> models.Pickup | None:
    pickup = (
        db.query(models.Pickup)
        .filter(models.Pickup.id == pickup_id, models.Pickup.user_id == user_id)
        .first()
    )
    if not pickup:
        return None
    pickup.status = "picked_up"
    db.commit()
    db.refresh(pickup)
    return pickup


def cancel_pickup(db: Session, pickup_id: int, user_id: str) -> bool:
    pickup = (
        db.query(models.Pickup)
        .filter(models.Pickup.id == pickup_id, models.Pickup.user_id == user_id)
        .first()
    )
    if not pickup:
        return False
    pickup.status = "cancelled"
    db.commit()
    return True


def delete_pickup(db: Session, pickup_id: int, user_id: str) -> bool:
    pickup = (
        db.query(models.Pickup)
        .filter(models.Pickup.id == pickup_id, models.Pickup.user_id == user_id)
        .first()
    )
    if not pickup:
        return False
    db.delete(pickup)
    db.commit()
    return True


def search_pickups(
    db: Session,
    user_id: str,
    filters: dict,
    page: int = 1,
    limit: int = 10,
) -> tuple[list[models.Pickup], int]:
    query = db.query(models.Pickup).filter(models.Pickup.user_id == user_id)

    # Text search
    if filters.get("query"):
        term = f"%{filters['query']}%"
        query = query.filter(
            models.Pickup.device_name.ilike(term)
            | models.Pickup.category.ilike(term)
            | models.Pickup.address.ilike(term)
            | models.Pickup.notes.ilike(term)
        )

    # Status filter
    if filters.get("status"):
        query = query.filter(models.Pickup.status.in_(filters["status"]))

    # Category filter
    if filters.get("categories"):
        query = query.filter(models.Pickup.category.in_(filters["categories"]))

    # Condition filter
    if filters.get("condition"):
        query = query.filter(models.Pickup.condition.in_(filters["condition"]))

    # Date range
    if filters.get("date_from"):
        query = query.filter(models.Pickup.pickup_date >= filters["date_from"])
    if filters.get("date_to"):
        query = query.filter(models.Pickup.pickup_date <= filters["date_to"])

    # Count before pagination
    total = query.count()

    # Sorting
    sort_field = filters.get("sort_by", "date")
    sort_order = filters.get("sort_order", "desc")
    if sort_field == "name":
        order_col = models.Pickup.device_name
    elif sort_field == "status":
        order_col = models.Pickup.status
    else:
        order_col = models.Pickup.created_at

    if sort_order == "asc":
        query = query.order_by(order_col.asc())
    else:
        query = query.order_by(order_col.desc())

    # Paginate
    offset = (page - 1) * limit
    items = query.offset(offset).limit(limit).all()

    return items, total


def get_search_stats(db: Session, user_id: str) -> dict:
    from sqlalchemy import func

    # By status
    status_rows = (
        db.query(models.Pickup.status, func.count())
        .filter(models.Pickup.user_id == user_id)
        .group_by(models.Pickup.status)
        .all()
    )
    by_status = {row[0]: row[1] for row in status_rows}

    # By category
    category_rows = (
        db.query(models.Pickup.category, func.count())
        .filter(models.Pickup.user_id == user_id)
        .group_by(models.Pickup.category)
        .all()
    )
    by_category = {row[0]: row[1] for row in category_rows}

    # By condition
    condition_rows = (
        db.query(models.Pickup.condition, func.count())
        .filter(models.Pickup.user_id == user_id)
        .group_by(models.Pickup.condition)
        .all()
    )
    by_condition = {row[0]: row[1] for row in condition_rows}

    total = db.query(models.Pickup).filter(models.Pickup.user_id == user_id).count()

    return {
        "by_status": by_status,
        "by_category": by_category,
        "by_condition": by_condition,
        "total_pickups": total,
    }
