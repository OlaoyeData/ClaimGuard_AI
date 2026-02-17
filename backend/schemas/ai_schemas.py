from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from enum import Enum


class DamageType(str, Enum):
    NONE = "none"
    MINOR = "minor"
    MODERATE = "moderate"
    SEVERE = "severe"


class FraudRisk(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


class VerificationChecks(BaseModel):
    gps_match: bool = True
    time_match: bool = True
    vin_match: bool = True


class AIAnalysisResponse(BaseModel):
    damage_severity: DamageType
    fraud_risk: FraudRisk
    confidence_score: float = Field(..., ge=0.0, le=1.0)
    is_real_image: bool
    verification_checks: VerificationChecks
    estimated_cost: float = Field(..., ge=0.0)
    
    class Config:
        from_attributes = True


class AIAnalysisCreate(BaseModel):
    claim_id: str
    damage_severity: DamageType
    fraud_risk: FraudRisk
    confidence_score: float
    is_real_image: bool
    gps_match: bool = True
    time_match: bool = True
    vin_match: bool = True
    estimated_cost: float
    raw_prediction: Optional[str] = None
