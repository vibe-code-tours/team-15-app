import random
import string
from datetime import datetime, timezone
from sqlalchemy.orm import Session
import models


def _generate_code() -> str:
    chars = string.ascii_uppercase + string.digits
    return "".join(random.choices(chars, k=8))


def get_or_create_referral_code(db: Session, user_id: str) -> str:
    existing = (
        db.query(models.Referral)
        .filter(models.Referral.referrer_id == user_id)
        .first()
    )
    if existing:
        return existing.referral_code

    # Generate unique code
    code = _generate_code()
    while db.query(models.Referral).filter(models.Referral.referral_code == code).first():
        code = _generate_code()

    referral = models.Referral(
        id=str(__import__("uuid").uuid4()),
        referrer_id=user_id,
        referral_code=code,
        status="pending",
        created_at=datetime.now(timezone.utc).isoformat(),
    )
    db.add(referral)
    db.commit()
    return code


def get_referral_stats(db: Session, user_id: str) -> dict:
    # Get or create points record
    points_record = db.query(models.UserPoints).filter(models.UserPoints.user_id == user_id).first()
    if not points_record:
        points_record = models.UserPoints(
            id=str(__import__("uuid").uuid4()),
            user_id=user_id,
            total_points=0,
            double_points_earned=0,
            referrals_made=0,
            co2_saved_from_referrals=0,
            created_at=datetime.now(timezone.utc).isoformat(),
            updated_at=datetime.now(timezone.utc).isoformat(),
        )
        db.add(points_record)
        db.commit()
        db.refresh(points_record)

    pending_count = (
        db.query(models.Referral)
        .filter(models.Referral.referrer_id == user_id, models.Referral.status == "pending")
        .count()
    )

    return {
        "total_points": points_record.total_points,
        "double_points_earned": points_record.double_points_earned,
        "referrals_made": points_record.referrals_made,
        "co2_saved_from_referrals": points_record.co2_saved_from_referrals,
        "pending_referrals": pending_count,
    }


def apply_referral_code(db: Session, code: str, new_user_id: str) -> dict:
    referral = (
        db.query(models.Referral)
        .filter(models.Referral.referral_code == code.upper())
        .first()
    )
    if not referral:
        return {"error": "Invalid referral code"}

    if referral.referrer_id == new_user_id:
        return {"error": "You cannot use your own referral code"}

    if referral.referred_id:
        return {"error": "This referral code has already been used"}

    referral.referred_id = new_user_id
    referral.status = "completed"
    referral.completed_at = datetime.now(timezone.utc).isoformat()

    # Increment referrer's referral count
    referrer_points = db.query(models.UserPoints).filter(
        models.UserPoints.user_id == referral.referrer_id
    ).first()
    if referrer_points:
        referrer_points.referrals_made += 1
        referrer_points.updated_at = datetime.now(timezone.utc).isoformat()

    db.commit()
    return {"success": True, "referrer_id": referral.referrer_id}


def award_impact_points(db: Session, user_id: str, pickup_id: int) -> dict:
    # Check if user was referred
    referral = (
        db.query(models.Referral)
        .filter(
            models.Referral.referred_id == user_id,
            models.Referral.status == "completed",
        )
        .first()
    )

    # Get pickup for CO2 calculation
    pickup = db.query(models.Pickup).filter(models.Pickup.id == pickup_id).first()
    if not pickup:
        return {"success": False, "reason": "Pickup not found"}

    co2_saved = 2.2 * (pickup.quantity or 1)

    # Award double points to referrer if applicable
    if referral:
        double_points = 200
        impact_event = models.ImpactEvent(
            id=str(__import__("uuid").uuid4()),
            user_id=referral.referrer_id,
            pickup_id=pickup_id,
            type="double_impact",
            points=double_points,
            co2_saved=co2_saved,
            referral_id=referral.id,
            created_at=datetime.now(timezone.utc).isoformat(),
        )
        db.add(impact_event)

        referrer_points = db.query(models.UserPoints).filter(
            models.UserPoints.user_id == referral.referrer_id
        ).first()
        if referrer_points:
            referrer_points.total_points += double_points
            referrer_points.double_points_earned += double_points
            referrer_points.co2_saved_from_referrals += co2_saved
            referrer_points.updated_at = datetime.now(timezone.utc).isoformat()

    # Always award base points to donating user
    donation_event = models.ImpactEvent(
        id=str(__import__("uuid").uuid4()),
        user_id=user_id,
        pickup_id=pickup_id,
        type="donation",
        points=100,
        co2_saved=co2_saved,
        created_at=datetime.now(timezone.utc).isoformat(),
    )
    db.add(donation_event)

    user_points = db.query(models.UserPoints).filter(
        models.UserPoints.user_id == user_id
    ).first()
    if user_points:
        user_points.total_points += 100
        user_points.updated_at = datetime.now(timezone.utc).isoformat()

    db.commit()
    return {"success": True, "points": 200 if referral else 100, "co2_saved": co2_saved}


def get_impact_timeline(db: Session, user_id: str) -> list[dict]:
    events = (
        db.query(models.ImpactEvent)
        .filter(models.ImpactEvent.user_id == user_id)
        .order_by(models.ImpactEvent.created_at.desc())
        .limit(20)
        .all()
    )
    return [
        {
            "id": e.id,
            "type": e.type,
            "points": e.points,
            "co2_saved": e.co2_saved,
            "created_at": e.created_at,
        }
        for e in events
    ]
