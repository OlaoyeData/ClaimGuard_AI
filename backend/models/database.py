from sqlalchemy import create_engine, Column, String, Integer, Float, Boolean, Text, DateTime, ForeignKey, Enum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, sessionmaker
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from datetime import datetime
import enum

from config import settings

Base = declarative_base()


class UserRole(str, enum.Enum):
    OWNER = "owner"
    AGENT = "agent"
    ADMIN = "admin"


class ClaimStatus(str, enum.Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    INFO_REQUESTED = "info_requested"


class FraudRisk(str, enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


class DamageType(str, enum.Enum):
    NONE = "none"
    MINOR = "minor"
    MODERATE = "moderate"
    SEVERE = "severe"


class User(Base):
    """User model"""
    __tablename__ = "users"
    
    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False, index=True)
    hashed_password = Column(String, nullable=False)
    role = Column(Enum(UserRole), default=UserRole.OWNER)
    avatar = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    claims = relationship("Claim", back_populates="claimant")


class Claim(Base):
    """Claim model"""
    __tablename__ = "claims"
    
    id = Column(String, primary_key=True)
    claim_number = Column(String, unique=True, nullable=False, index=True)
    claimant_id = Column(String, ForeignKey("users.id"), nullable=False)
    claimant_name = Column(String, nullable=False)
    
    # Vehicle information
    vehicle_make = Column(String, nullable=False)
    vehicle_model = Column(String, nullable=False)
    vehicle_year = Column(Integer, nullable=False)
    vehicle_vin = Column(String, nullable=True)
    
    # Claim details
    incident_date = Column(String, nullable=False)
    location = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    images = Column(Text, nullable=True)  # JSON string of image URLs
    
    # Status and analysis
    status = Column(Enum(ClaimStatus), default=ClaimStatus.PENDING, index=True)
    damage_type = Column(Enum(DamageType), nullable=True)
    
    # Policy information
    policy_number = Column(String, nullable=False)
    policy_type = Column(String, nullable=False)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    claimant = relationship("User", back_populates="claims")
    ai_analysis = relationship("AIAnalysisResult", back_populates="claim", uselist=False)
    comments = relationship("Comment", back_populates="claim")


class AIAnalysisResult(Base):
    """AI Analysis Result model"""
    __tablename__ = "ai_analysis_results"
    
    id = Column(String, primary_key=True)
    claim_id = Column(String, ForeignKey("claims.id"), nullable=False, unique=True)
    
    # Analysis results
    damage_severity = Column(Enum(DamageType), nullable=False)
    fraud_risk = Column(Enum(FraudRisk), nullable=False)
    confidence_score = Column(Float, nullable=False)
    is_real_image = Column(Boolean, default=True)
    
    # Verification checks
    gps_match = Column(Boolean, default=True)
    time_match = Column(Boolean, default=True)
    vin_match = Column(Boolean, default=True)
    
    # Cost estimation
    estimated_cost = Column(Float, default=0.0)
    
    # Raw data
    raw_prediction = Column(Text, nullable=True)  # JSON string
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    claim = relationship("Claim", back_populates="ai_analysis")


class Comment(Base):
    """Comment model for claims"""
    __tablename__ = "comments"
    
    id = Column(String, primary_key=True)
    claim_id = Column(String, ForeignKey("claims.id"), nullable=False)
    author = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    claim = relationship("Claim", back_populates="comments")


# Database session management
engine = None
async_session_maker = None


async def init_db():
    """Initialize database and create tables"""
    global engine, async_session_maker
    
    engine = create_async_engine(
        settings.DATABASE_URL,
        echo=settings.DEBUG,
        future=True,
    )
    
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    async_session_maker = async_sessionmaker(
        engine,
        class_=AsyncSession,
        expire_on_commit=False,
    )
    
    print("✅ Database tables created successfully")


async def get_db():
    """Dependency to get database session"""
    async with async_session_maker() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()
