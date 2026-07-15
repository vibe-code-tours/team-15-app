"""Add DirectMessage

Revision ID: b2dfd6e448a4
Revises: c739c67a3f70
Create Date: 2026-07-16 01:12:32.720400

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = 'b2dfd6e448a4'
down_revision: Union[str, None] = 'c739c67a3f70'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table('direct_messages',
    sa.Column('id', sa.UUID(), nullable=False),
    sa.Column('sender_id', sa.UUID(), nullable=False),
    sa.Column('receiver_id', sa.UUID(), nullable=False),
    sa.Column('content', sa.Text(), nullable=False),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
    sa.Column('read_at', sa.DateTime(timezone=True), nullable=True),
    sa.ForeignKeyConstraint(['receiver_id'], ['users.id'], ),
    sa.ForeignKeyConstraint(['sender_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index('idx_dm_participants_created', 'direct_messages', ['sender_id', 'receiver_id', 'created_at'], unique=False)
    op.create_index(op.f('ix_direct_messages_receiver_id'), 'direct_messages', ['receiver_id'], unique=False)
    op.create_index(op.f('ix_direct_messages_sender_id'), 'direct_messages', ['sender_id'], unique=False)


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_index(op.f('ix_direct_messages_sender_id'), table_name='direct_messages')
    op.drop_index(op.f('ix_direct_messages_receiver_id'), table_name='direct_messages')
    op.drop_index('idx_dm_participants_created', table_name='direct_messages')
    op.drop_table('direct_messages')
