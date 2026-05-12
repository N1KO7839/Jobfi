"""Add server_default to updated_datetime

Revision ID: d4c2df74d039
Revises: 23e9919eb2f5
Create Date: 2026-05-12 12:31:13.988406

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = 'd4c2df74d039'
down_revision: Union[str, Sequence[str], None] = '23e9919eb2f5'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.alter_column('user', 'updated_datetime', server_default=sa.text('now()'))


def downgrade() -> None:
    """Downgrade schema."""
    op.alter_column('user', 'updated_datetime', server_default=None)
