"""add pickup_requests table and remove old request columns from pickups

Revision ID: 006
Revises: 005
Create Date: 2026-07-15

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = "006"
down_revision: Union[str, None] = "005"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create the new pickup_requests table
    op.create_table(
        "pickup_requests",
        sa.Column("id", sa.Integer, primary_key=True, autoincrement=True),
        sa.Column("pickup_id", sa.Integer, nullable=False, index=True),
        sa.Column("requester_id", sa.String, nullable=False, index=True),
        sa.Column("pickup_from", sa.String, nullable=True),
        sa.Column("pickup_to", sa.String, nullable=True),
        sa.Column("time_slot", sa.String, nullable=True),
        sa.Column("status", sa.String, nullable=False, server_default="pending"),
        sa.Column("created_at", sa.String, nullable=False),
    )
    op.create_index(
        "idx_pickup_requests_unique",
        "pickup_requests",
        ["pickup_id", "requester_id"],
        unique=True,
    )

    # Migrate existing request data from pickups to pickup_requests
    op.execute("""
        INSERT INTO pickup_requests (pickup_id, requester_id, pickup_from, pickup_to, time_slot, status, created_at)
        SELECT id, requested_by, requested_pickup_from, requested_pickup_to, requested_time_slot, 'accepted', created_at
        FROM pickups
        WHERE requested_by IS NOT NULL
    """)

    # Drop old request columns from pickups
    op.drop_column("pickups", "requested_by")
    op.drop_column("pickups", "requested_pickup_from")
    op.drop_column("pickups", "requested_pickup_to")
    op.drop_column("pickups", "requested_time_slot")


def downgrade() -> None:
    # Add back old columns to pickups
    op.add_column("pickups", sa.Column("requested_by", sa.String, nullable=True))
    op.add_column("pickups", sa.Column("requested_pickup_from", sa.String, nullable=True))
    op.add_column("pickups", sa.Column("requested_pickup_to", sa.String, nullable=True))
    op.add_column("pickups", sa.Column("requested_time_slot", sa.String, nullable=True))

    # Migrate data back (only take the first/accepted request per pickup)
    op.execute("""
        UPDATE pickups SET
            requested_by = pr.requester_id,
            requested_pickup_from = pr.pickup_from,
            requested_pickup_to = pr.pickup_to,
            requested_time_slot = pr.time_slot
        FROM pickup_requests pr
        WHERE pickups.id = pr.pickup_id AND pr.status = 'accepted'
    """)

    # Drop the pickup_requests table
    op.drop_index("idx_pickup_requests_unique", table_name="pickup_requests")
    op.drop_table("pickup_requests")
