from datetime import datetime, timezone
from sqlalchemy.orm import Session
from sqlalchemy import func
import models


def get_user_stats(db: Session, user_id: str) -> dict:
    pickup_count = (
        db.query(func.count())
        .select_from(models.Pickup)
        .filter(models.Pickup.user_id == user_id)
        .scalar()
        or 0
    )

    referral_count = (
        db.query(func.count())
        .select_from(models.Referral)
        .filter(models.Referral.referrer_id == user_id)
        .scalar()
        or 0
    )

    points = db.query(models.UserPoints).filter(models.UserPoints.user_id == user_id).first()

    return {
        "total_pickups": pickup_count,
        "total_referrals": referral_count,
        "total_points": points.total_points if points else 0,
    }


def get_notification_preferences(db: Session, user_id: str) -> dict:
    settings = db.query(models.UserSetting).filter(models.UserSetting.user_id == user_id).first()
    if not settings:
        settings = models.UserSetting(
            id=str(__import__("uuid").uuid4()),
            user_id=user_id,
            email_pickup_updates=True,
            email_referral_alerts=True,
            email_milestones=True,
            push_enabled=False,
            created_at=datetime.now(timezone.utc).isoformat(),
            updated_at=datetime.now(timezone.utc).isoformat(),
        )
        db.add(settings)
        db.commit()
        db.refresh(settings)

    return {
        "email_pickup_updates": settings.email_pickup_updates,
        "email_referral_alerts": settings.email_referral_alerts,
        "email_milestones": settings.email_milestones,
        "push_enabled": settings.push_enabled,
    }


def update_notification_preferences(db: Session, user_id: str, prefs: dict) -> bool:
    settings = db.query(models.UserSetting).filter(models.UserSetting.user_id == user_id).first()
    now = datetime.now(timezone.utc).isoformat()

    if not settings:
        settings = models.UserSetting(
            id=str(__import__("uuid").uuid4()),
            user_id=user_id,
            created_at=now,
            updated_at=now,
        )
        db.add(settings)

    for key, value in prefs.items():
        if value is not None:
            setattr(settings, key, value)
    settings.updated_at = now
    db.commit()
    return True


def export_user_data(db: Session, user_id: str) -> dict:
    user = db.query(models.User).filter(models.User.id == user_id).first()
    pickups = db.query(models.Pickup).filter(models.Pickup.user_id == user_id).all()
    referrals = db.query(models.Referral).filter(models.Referral.referrer_id == user_id).all()
    points = db.query(models.UserPoints).filter(models.UserPoints.user_id == user_id).first()
    impact_events = db.query(models.ImpactEvent).filter(models.ImpactEvent.user_id == user_id).all()
    settings = db.query(models.UserSetting).filter(models.UserSetting.user_id == user_id).first()

    return {
        "export_date": datetime.now(timezone.utc).isoformat(),
        "profile": {"name": user.name, "email": user.email, "created_at": str(user.created_at)} if user else None,
        "pickups": [{"id": p.id, "category": p.category, "device_name": p.device_name, "status": p.status} for p in pickups],
        "referrals": [{"id": r.id, "referral_code": r.referral_code, "status": r.status} for r in referrals],
        "points": {"total_points": points.total_points} if points else None,
        "impact_events": [{"type": e.type, "points": e.points} for e in impact_events],
        "settings": {"email_pickup_updates": settings.email_pickup_updates} if settings else None,
    }


def delete_user_data(db: Session, user_id: str) -> bool:
    db.query(models.ImpactEvent).filter(models.ImpactEvent.user_id == user_id).delete()
    db.query(models.UserSetting).filter(models.UserSetting.user_id == user_id).delete()
    db.query(models.UserPoints).filter(models.UserPoints.user_id == user_id).delete()
    db.query(models.Referral).filter(models.Referral.referrer_id == user_id).delete()
    db.query(models.Pickup).filter(models.Pickup.user_id == user_id).delete()
    db.query(models.User).filter(models.User.id == user_id).delete()
    db.commit()
    return True
