from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum

from schemas.ai_schemas import AIAnalysisResponse


class ClaimStatus(str, Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    INFO_REQUESTED = "info_requested"


class DamageType(str, Enum):
    NONE = "none"
    MINOR = "minor"
    MODERATE = "moderate"
    SEVERE = "severe"


class VehicleInfo(BaseModel):
    make: str
    model: str
    year: int = Field(..., ge=1900, le=2100)
    vin: Optional[str] = None


class CommentBase(BaseModel):
    author: str
    content: str


class CommentResponse(CommentBase):
    id: str
    timestamp: datetime
    
    class Config:
        from_attributes = True


class ClaimBase(BaseModel):
    claimant_name: str
    vehicle_info: VehicleInfo
    incident_date: str
    location: str
    description: str
    policy_number: str
    policy_type: str


class ClaimCreate(ClaimBase):
    images: Optional[List[str]] = []


class ClaimUpdate(BaseModel):
    status: Optional[ClaimStatus] = None
    damage_type: Optional[DamageType] = None
    description: Optional[str] = None


class ClaimResponse(BaseModel):
    id: str
    claim_number: str
    claimant_id: str
    claimant_name: str
    vehicle_info: VehicleInfo
    incident_date: str
    location: str
    description: str
    images: List[str]
    status: ClaimStatus
    damage_type: Optional[DamageType] = None
    ai_analysis: Optional[AIAnalysisResponse] = None
    policy_number: str
    policy_type: str
    created_at: datetime
    updated_at: datetime
    comments: List[CommentResponse] = []
    
    class Config:
        from_attributes = True
