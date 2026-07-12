import uuid
from sqlalchemy import Column, String, Integer, ForeignKey, Index
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from database import Base


class Category(Base):
    __tablename__ = "categories"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False, unique=True, index=True)
    parent_category_id = Column(UUID(as_uuid=True), ForeignKey("categories.id"), comment="optional, for subcategories")

    # Relationships
    subcategories = relationship("Category", back_populates="parent_category", remote_side=[id])
    parent_category = relationship("Category", back_populates="subcategories", remote_side=[parent_category_id])
    listings = relationship("Listing", back_populates="category")
