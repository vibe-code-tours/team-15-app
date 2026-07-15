# Re-export all models for backward compatibility
# Usage: import models; models.User, models.Listing, etc.

from models.base import UserStatus, AuthProvider
from models.regions import Region
from models.auth import User, OTPCode
from models.categories import Category
from models.listings import (
    ItemCondition, ListingStatus, PickupPreference,
    Listing, ListingPhoto, WatchlistItem,
)
from models.requests import RequestStatus, Request, Message
from models.moderation import (
    ReportTargetType, ReportStatus, AdminActionType,
    Report, AdminAction,
)
from models.notifications import NotificationChannel, NotificationType, Notification
from models.pickups import PickupStatus, Pickup
from models.pickup_requests import PickupRequestStatus, PickupRequest
from models.referrals import ReferralStatus, Referral
from models.gamification import UserPoints, ImpactEvent
from models.settings import UserSetting
from models.chat import DirectMessage

__all__ = [
    # Enums
    "UserStatus", "AuthProvider",
    "ItemCondition", "ListingStatus", "PickupPreference",
    "RequestStatus",
    "ReportTargetType", "ReportStatus", "AdminActionType",
    "NotificationChannel", "NotificationType",
    "PickupStatus",
    "PickupRequestStatus",
    "ReferralStatus",
    # Models
    "Region",
    "User", "OTPCode",
    "Category",
    "Listing", "ListingPhoto", "WatchlistItem",
    "Request", "Message",
    "Report", "AdminAction",
    "Notification",
    "Pickup",
    "PickupRequest",
    "Referral",
    "UserPoints", "ImpactEvent",
    "UserSetting",
    "DirectMessage",
]
