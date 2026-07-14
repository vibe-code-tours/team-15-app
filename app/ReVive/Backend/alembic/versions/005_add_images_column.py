"""add images column to pickups

Revision ID: 005
Revises: 004
Create Date: 2026-07-14

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = "005"
down_revision: Union[str, None] = "004"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "pickups",
        sa.Column("images", sa.Text, nullable=True, comment="JSON array of image URLs"),
    )


def downgrade() -> None:
    op.drop_column("pickups", "images")
