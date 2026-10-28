"""add_source_to_job_offers

Revision ID: e60966a9ec32
Revises: affd3cb14d7a
Create Date: 2026-10-28 19:31:52.347461

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "e60966a9ec32"
down_revision: Union[str, Sequence[str], None] = "affd3cb14d7a"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column(
        "job_offers",
        sa.Column("source", sa.String(), server_default="Unknown", nullable=False),
    )
    op.execute(
        "UPDATE job_offers SET source = 'JustJoinIt' WHERE url LIKE '%justjoin.it%'"
    )
    op.execute(
        "UPDATE job_offers SET source = 'Pracuj.pl' WHERE url LIKE '%pracuj.pl%'"
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column("job_offers", "source")
