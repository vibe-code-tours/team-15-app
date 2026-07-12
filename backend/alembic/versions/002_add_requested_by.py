"""add requested_by to pickups

Revision ID: 002
Revises: 001
Create Date: 2026-07-12

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = "002"
down_revision: Union[str, None] = "001"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "pickups",
        sa.Column("requested_by", sa.String, nullable=True, comment="user_id of person who requested this item"),
    )


def downgrade() -> None:
    op.drop_column("pickups", "requested_by")
