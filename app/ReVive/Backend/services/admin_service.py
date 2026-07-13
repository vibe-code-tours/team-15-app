from sqlalchemy.orm import Session
from sqlalchemy import func
import models


def get_admin_stats(db: Session) -> dict:
    total_pickups = db.query(func.count()).select_from(models.Pickup).scalar() or 0

    completed_pickups = (
        db.query(func.count())
        .select_from(models.Pickup)
        .filter(models.Pickup.status == "picked_up")
        .scalar()
        or 0
    )

    active_users = db.query(func.count()).select_from(models.User).scalar() or 0

    items_result = (
        db.query(func.coalesce(func.sum(models.Pickup.quantity), 0))
        .filter(models.Pickup.status != "cancelled")
        .scalar()
    )
    total_items = int(items_result) if items_result else 0
    total_co2_saved = f"{total_items * 2.2:.1f}"

    recent_pickups = (
        db.query(models.Pickup)
        .order_by(models.Pickup.created_at.desc())
        .limit(5)
        .all()
    )

    return {
        "total_pickups": total_pickups,
        "completed_pickups": completed_pickups,
        "active_users": active_users,
        "total_items": total_items,
        "total_co2_saved": total_co2_saved,
        "recent_pickups": [
            {
                "id": p.id,
                "device_name": p.device_name,
                "category": p.category,
                "status": p.status,
                "created_at": p.created_at,
                "user_name": None,
            }
            for p in recent_pickups
        ],
    }


def get_all_pickups(db: Session) -> list[dict]:
    pickups = (
        db.query(models.Pickup)
        .order_by(models.Pickup.created_at.desc())
        .all()
    )
    return [
        {
            "id": p.id,
            "user_id": p.user_id,
            "category": p.category,
            "device_name": p.device_name,
            "quantity": p.quantity,
            "condition": p.condition,
            "available_from": p.available_from,
            "available_to": p.available_to,
            "time_slot": p.time_slot,
            "address": p.address,
            "notes": p.notes,
            "status": p.status,
            "created_at": p.created_at,
            "user_name": None,
            "user_email": None,
        }
        for p in pickups
    ]


def get_all_users(db: Session) -> list[dict]:
    users = db.query(models.User).order_by(models.User.created_at.desc()).all()
    result = []
    for u in users:
        pickup_count = (
            db.query(func.count())
            .select_from(models.Pickup)
            .filter(models.Pickup.user_id == str(u.id))
            .scalar()
            or 0
        )
        points = db.query(models.UserPoints).filter(models.UserPoints.user_id == str(u.id)).first()
        result.append({
            "id": str(u.id),
            "name": u.name,
            "email": u.email,
            "created_at": str(u.created_at) if u.created_at else "",
            "pickup_count": pickup_count,
            "total_points": points.total_points if points else 0,
        })
    return result


def get_category_breakdown(db: Session) -> list[dict]:
    rows = (
        db.query(models.Pickup.category, func.count())
        .group_by(models.Pickup.category)
        .order_by(func.count().desc())
        .all()
    )
    return [{"label": r[0], "count": r[1]} for r in rows]


def get_status_breakdown(db: Session) -> list[dict]:
    rows = (
        db.query(models.Pickup.status, func.count())
        .group_by(models.Pickup.status)
        .order_by(func.count().desc())
        .all()
    )
    return [{"label": r[0], "count": r[1]} for r in rows]
