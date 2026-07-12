"""initial schema

Revision ID: 001
Revises:
Create Date: 2026-07-12

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID

revision: str = "001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Enums are created by SQLAlchemy models - no need to create them here

    # Regions
    op.create_table(
        "regions",
        sa.Column("id", UUID(as_uuid=True), primary_key=True),
        sa.Column("city", sa.String, nullable=False),
        sa.Column("postal_code", sa.String),
        sa.Column("country", sa.String, nullable=False, server_default="N/A"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index("idx_regions_city_postal", "regions", ["city", "postal_code"])

    # Users
    op.create_table(
        "users",
        sa.Column("id", UUID(as_uuid=True), primary_key=True),
        sa.Column("name", sa.String, nullable=False),
        sa.Column("email", sa.String, unique=True, nullable=False),
        sa.Column("phone", sa.String, unique=True),
        sa.Column("password_hash", sa.String),
        sa.Column("auth_provider", sa.String, nullable=False, server_default="email"),
        sa.Column("profile_picture_url", sa.String),
        sa.Column("region_id", UUID(as_uuid=True), sa.ForeignKey("regions.id")),
        sa.Column("status", sa.String, nullable=False, server_default="active"),
        sa.Column("notification_prefs", sa.JSON),
        sa.Column("items_donated_count", sa.Integer, nullable=False, server_default="0"),
        sa.Column("items_received_count", sa.Integer, nullable=False, server_default="0"),
        sa.Column("banned_ip", sa.String),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index("ix_users_email", "users", ["email"])
    op.create_index("ix_users_phone", "users", ["phone"])
    op.create_index("ix_users_status", "users", ["status"])

    # OTP Codes
    op.create_table(
        "otp_codes",
        sa.Column("id", UUID(as_uuid=True), primary_key=True),
        sa.Column("user_id", UUID(as_uuid=True), sa.ForeignKey("users.id")),
        sa.Column("destination", sa.String, nullable=False),
        sa.Column("code_hash", sa.String, nullable=False),
        sa.Column("purpose", sa.String, nullable=False),
        sa.Column("expires_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("consumed_at", sa.DateTime(timezone=True)),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index("idx_otp_user_purpose", "otp_codes", ["user_id", "purpose"])

    # Categories
    op.create_table(
        "categories",
        sa.Column("id", UUID(as_uuid=True), primary_key=True),
        sa.Column("name", sa.String, nullable=False, unique=True),
        sa.Column("parent_category_id", UUID(as_uuid=True), sa.ForeignKey("categories.id")),
    )
    op.create_index("ix_categories_name", "categories", ["name"], unique=True)

    # Listings
    op.create_table(
        "listings",
        sa.Column("id", UUID(as_uuid=True), primary_key=True),
        sa.Column("owner_id", UUID(as_uuid=True), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("category_id", UUID(as_uuid=True), sa.ForeignKey("categories.id"), nullable=False),
        sa.Column("region_id", UUID(as_uuid=True), sa.ForeignKey("regions.id"), nullable=False),
        sa.Column("title", sa.String, nullable=False),
        sa.Column("description", sa.Text),
        sa.Column("brand", sa.String),
        sa.Column("model", sa.String),
        sa.Column("condition", sa.String, nullable=False),
        sa.Column("pickup_preference", sa.String, nullable=False, server_default="flexible"),
        sa.Column("status", sa.String, nullable=False, server_default="available"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("archived_at", sa.DateTime(timezone=True)),
    )
    op.create_index("ix_listings_owner_id", "listings", ["owner_id"])
    op.create_index("ix_listings_category_id", "listings", ["category_id"])
    op.create_index("idx_listings_region_status", "listings", ["region_id", "status"])
    op.create_index("idx_listings_title_search", "listings", ["title"])

    # Listing Photos
    op.create_table(
        "listing_photos",
        sa.Column("id", UUID(as_uuid=True), primary_key=True),
        sa.Column("listing_id", UUID(as_uuid=True), sa.ForeignKey("listings.id"), nullable=False),
        sa.Column("url", sa.String, nullable=False),
        sa.Column("sort_order", sa.Integer, nullable=False, server_default="0"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index("ix_listing_photos_listing_id", "listing_photos", ["listing_id"])

    # Watchlist Items
    op.create_table(
        "watchlist_items",
        sa.Column("id", UUID(as_uuid=True), primary_key=True),
        sa.Column("user_id", UUID(as_uuid=True), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("listing_id", UUID(as_uuid=True), sa.ForeignKey("listings.id"), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.UniqueConstraint("user_id", "listing_id", name="uq_watchlist_user_listing"),
    )

    # Requests
    op.create_table(
        "requests",
        sa.Column("id", UUID(as_uuid=True), primary_key=True),
        sa.Column("listing_id", UUID(as_uuid=True), sa.ForeignKey("listings.id"), nullable=False),
        sa.Column("requester_id", UUID(as_uuid=True), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("note", sa.Text),
        sa.Column("status", sa.String, nullable=False, server_default="pending"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("responded_at", sa.DateTime(timezone=True)),
        sa.Column("confirmed_at", sa.DateTime(timezone=True)),
        sa.UniqueConstraint("listing_id", "requester_id", name="uq_request_listing_requester"),
    )
    op.create_index("ix_requests_listing_id", "requests", ["listing_id"])
    op.create_index("ix_requests_requester_id", "requests", ["requester_id"])

    # Messages
    op.create_table(
        "messages",
        sa.Column("id", UUID(as_uuid=True), primary_key=True),
        sa.Column("request_id", UUID(as_uuid=True), sa.ForeignKey("requests.id"), nullable=False),
        sa.Column("sender_id", UUID(as_uuid=True), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("body", sa.Text, nullable=False),
        sa.Column("sent_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("read_at", sa.DateTime(timezone=True)),
    )
    op.create_index("idx_messages_thread_order", "messages", ["request_id", "sent_at"])

    # Reports
    op.create_table(
        "reports",
        sa.Column("id", UUID(as_uuid=True), primary_key=True),
        sa.Column("reporter_id", UUID(as_uuid=True), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("target_type", sa.String, nullable=False),
        sa.Column("target_listing_id", UUID(as_uuid=True), sa.ForeignKey("listings.id")),
        sa.Column("target_user_id", UUID(as_uuid=True), sa.ForeignKey("users.id")),
        sa.Column("reason", sa.String, nullable=False),
        sa.Column("details", sa.Text),
        sa.Column("status", sa.String, nullable=False, server_default="open"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index("ix_reports_target_listing_id", "reports", ["target_listing_id"])
    op.create_index("ix_reports_target_user_id", "reports", ["target_user_id"])
    op.create_index("ix_reports_status", "reports", ["status"])

    # Admin Actions
    op.create_table(
        "admin_actions",
        sa.Column("id", UUID(as_uuid=True), primary_key=True),
        sa.Column("admin_id", UUID(as_uuid=True), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("report_id", UUID(as_uuid=True), sa.ForeignKey("reports.id")),
        sa.Column("action", sa.String, nullable=False),
        sa.Column("target_user_id", UUID(as_uuid=True), sa.ForeignKey("users.id")),
        sa.Column("target_listing_id", UUID(as_uuid=True), sa.ForeignKey("listings.id")),
        sa.Column("reason", sa.Text),
        sa.Column("suspension_ends_at", sa.DateTime(timezone=True)),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index("ix_admin_actions_report_id", "admin_actions", ["report_id"])
    op.create_index("ix_admin_actions_target_user_id", "admin_actions", ["target_user_id"])

    # Notifications
    op.create_table(
        "notifications",
        sa.Column("id", UUID(as_uuid=True), primary_key=True),
        sa.Column("user_id", UUID(as_uuid=True), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("type", sa.String, nullable=False),
        sa.Column("channel", sa.String, nullable=False),
        sa.Column("payload", sa.JSON),
        sa.Column("sent_at", sa.DateTime(timezone=True)),
        sa.Column("read_at", sa.DateTime(timezone=True)),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index("idx_notifications_unread", "notifications", ["user_id", "read_at"])

    # Pickups (e-waste donation listings)
    op.create_table(
        "pickups",
        sa.Column("id", sa.Integer, primary_key=True, autoincrement=True),
        sa.Column("user_id", sa.String, nullable=False),
        sa.Column("category", sa.String, nullable=False),
        sa.Column("device_name", sa.String, nullable=False),
        sa.Column("quantity", sa.Integer, nullable=False, server_default="1"),
        sa.Column("condition", sa.String, nullable=False, server_default="working"),
        sa.Column("pickup_date", sa.String, nullable=False),
        sa.Column("time_slot", sa.String, nullable=False),
        sa.Column("address", sa.String, nullable=False),
        sa.Column("notes", sa.Text),
        sa.Column("status", sa.String, nullable=False, server_default="available"),
        sa.Column("created_at", sa.String, nullable=False),
    )
    op.create_index("idx_pickups_user_status", "pickups", ["user_id", "status"])

    # Referrals
    op.create_table(
        "referrals",
        sa.Column("id", sa.String, primary_key=True),
        sa.Column("referrer_id", sa.String, nullable=False),
        sa.Column("referred_id", sa.String),
        sa.Column("referral_code", sa.String, nullable=False, unique=True),
        sa.Column("status", sa.String, nullable=False, server_default="pending"),
        sa.Column("created_at", sa.String, nullable=False),
        sa.Column("completed_at", sa.String),
    )
    op.create_index("idx_referrals_referrer_id", "referrals", ["referrer_id"])
    op.create_index("idx_referrals_referred_id", "referrals", ["referred_id"])
    op.create_index("idx_referrals_status", "referrals", ["status"])

    # User Points (gamification)
    op.create_table(
        "user_points",
        sa.Column("id", sa.String, primary_key=True),
        sa.Column("user_id", sa.String, nullable=False, unique=True),
        sa.Column("total_points", sa.Integer, nullable=False, server_default="0"),
        sa.Column("double_points_earned", sa.Integer, nullable=False, server_default="0"),
        sa.Column("referrals_made", sa.Integer, nullable=False, server_default="0"),
        sa.Column("co2_saved_from_referrals", sa.Float, nullable=False, server_default="0"),
        sa.Column("created_at", sa.String, nullable=False),
        sa.Column("updated_at", sa.String, nullable=False),
    )

    # Impact Events
    op.create_table(
        "impact_events",
        sa.Column("id", sa.String, primary_key=True),
        sa.Column("user_id", sa.String, nullable=False),
        sa.Column("pickup_id", sa.Integer, sa.ForeignKey("pickups.id")),
        sa.Column("type", sa.String, nullable=False),
        sa.Column("points", sa.Integer, nullable=False),
        sa.Column("co2_saved", sa.Float),
        sa.Column("referral_id", sa.String, sa.ForeignKey("referrals.id")),
        sa.Column("created_at", sa.String, nullable=False),
    )
    op.create_index("idx_impact_events_user_id", "impact_events", ["user_id"])
    op.create_index("idx_impact_events_referral", "impact_events", ["referral_id"])

    # User Settings
    op.create_table(
        "user_settings",
        sa.Column("id", sa.String, primary_key=True),
        sa.Column("user_id", sa.String, nullable=False, unique=True),
        sa.Column("email_pickup_updates", sa.Boolean, nullable=False, server_default="1"),
        sa.Column("email_referral_alerts", sa.Boolean, nullable=False, server_default="1"),
        sa.Column("email_milestones", sa.Boolean, nullable=False, server_default="1"),
        sa.Column("push_enabled", sa.Boolean, nullable=False, server_default="0"),
        sa.Column("created_at", sa.String, nullable=False),
        sa.Column("updated_at", sa.String, nullable=False),
    )


def downgrade() -> None:
    op.drop_table("user_settings")
    op.drop_table("impact_events")
    op.drop_table("user_points")
    op.drop_table("referrals")
    op.drop_table("pickups")
    op.drop_table("notifications")
    op.drop_table("admin_actions")
    op.drop_table("reports")
    op.drop_table("messages")
    op.drop_table("requests")
    op.drop_table("watchlist_items")
    op.drop_table("listing_photos")
    op.drop_table("listings")
    op.drop_table("categories")
    op.drop_table("otp_codes")
    op.drop_table("users")
    op.drop_table("regions")
