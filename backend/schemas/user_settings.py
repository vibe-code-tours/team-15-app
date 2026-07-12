from pydantic import BaseModel


class UserStatsResponse(BaseModel):
    total_pickups: int
    total_referrals: int
    total_points: int


class NotificationPreferencesResponse(BaseModel):
    email_pickup_updates: bool
    email_referral_alerts: bool
    email_milestones: bool
    push_enabled: bool


class NotificationPreferencesUpdate(BaseModel):
    email_pickup_updates: bool | None = None
    email_referral_alerts: bool | None = None
    email_milestones: bool | None = None
    push_enabled: bool | None = None


class DataExportResponse(BaseModel):
    export_date: str
    profile: dict | None
    pickups: list[dict]
    referrals: list[dict]
    points: dict | None
    impact_events: list[dict]
    settings: dict | None
