from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from typing import List, Optional
import uuid
import json
from datetime import datetime

from models.database import get_db, Claim, User, AIAnalysisResult
from schemas.claim_schemas import ClaimCreate, ClaimResponse, ClaimUpdate, VehicleInfo
from schemas.ai_schemas import AIAnalysisCreate
from utils.auth_utils import get_current_active_user
from utils.image_processor import save_upload_file
from main import get_ml_model

router = APIRouter()


def generate_claim_number() -> str:
    """Generate a unique claim number"""
    timestamp = datetime.now().strftime("%Y%m%d")
    random_part = str(uuid.uuid4())[:8].upper()
    return f"CLM-{timestamp}-{random_part}"


@router.post("", response_model=ClaimResponse, status_code=status.HTTP_201_CREATED)
async def create_claim(
    claimant_name: str = Form(...),
    vehicle_make: str = Form(...),
    vehicle_model: str = Form(...),
    vehicle_year: int = Form(...),
    vehicle_vin: Optional[str] = Form(None),
    incident_date: str = Form(...),
    location: str = Form(...),
    description: str = Form(...),
    policy_number: str = Form(...),
    policy_type: str = Form(...),
    images: List[UploadFile] = File(default=[]),
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Create a new insurance claim with optional images
    
    Images will be automatically analyzed by the AI model
    """
    try:
        # Save uploaded images
        image_paths = []
        for image in images:
            file_path = await save_upload_file(image)
            image_paths.append(file_path)
        
        # Create claim
        new_claim = Claim(
            id=str(uuid.uuid4()),
            claim_number=generate_claim_number(),
            claimant_id=current_user.id,
            claimant_name=claimant_name,
            vehicle_make=vehicle_make,
            vehicle_model=vehicle_model,
            vehicle_year=vehicle_year,
            vehicle_vin=vehicle_vin,
            incident_date=incident_date,
            location=location,
            description=description,
            images=json.dumps(image_paths),
            policy_number=policy_number,
            policy_type=policy_type
        )
        
        db.add(new_claim)
        await db.commit()
        await db.refresh(new_claim)
        
        # If images provided, run AI analysis on the first image
        if images and len(images) > 0:
            try:
                ml_model = get_ml_model()
                if ml_model:
                    # Read first image
                    await images[0].seek(0)  # Reset file pointer
                    image_data = await images[0].read()
                    
                    # Run prediction
                    result = ml_model.predict_fraud(image_data)
                    
                    # Save AI analysis result
                    ai_analysis = AIAnalysisResult(
                        id=str(uuid.uuid4()),
                        claim_id=new_claim.id,
                        damage_severity=result["damage_severity"],
                        fraud_risk=result["fraud_risk"],
                        confidence_score=result["confidence_score"],
                        is_real_image=result["is_real_image"],
                        gps_match=result["verification_checks"]["gps_match"],
                        time_match=result["verification_checks"]["time_match"],
                        vin_match=result["verification_checks"]["vin_match"],
                        estimated_cost=result["estimated_cost"],
                        raw_prediction=json.dumps(result.get("raw_prediction", []))
                    )
                    
                    db.add(ai_analysis)
                    new_claim.damage_type = result["damage_severity"]
                    await db.commit()
                    await db.refresh(new_claim)
            except Exception as e:
                print(f"Warning: AI analysis failed: {str(e)}")
        
        # Load relationships
        result = await db.execute(
            select(Claim).where(Claim.id == new_claim.id)
        )
        claim_with_relations = result.scalar_one()
        
        # Convert to response
        return convert_claim_to_response(claim_with_relations)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating claim: {str(e)}")


@router.get("", response_model=List[ClaimResponse])
async def list_claims(
    status: Optional[str] = None,
    limit: int = 50,
    offset: int = 0,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """
    List all claims for the current user
    
    Supports filtering by status and pagination
    """
    query = select(Claim).where(Claim.claimant_id == current_user.id)
    
    if status:
        query = query.where(Claim.status == status)
    
    query = query.order_by(desc(Claim.created_at)).limit(limit).offset(offset)
    
    result = await db.execute(query)
    claims = result.scalars().all()
    
    return [convert_claim_to_response(claim) for claim in claims]


@router.get("/{claim_id}", response_model=ClaimResponse)
async def get_claim(
    claim_id: str,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Get a specific claim by ID"""
    result = await db.execute(select(Claim).where(Claim.id == claim_id))
    claim = result.scalar_one_or_none()
    
    if not claim:
        raise HTTPException(status_code=404, detail="Claim not found")
    
    # Check ownership (unless admin)
    if claim.claimant_id != current_user.id and current_user.role.value != "admin":
        raise HTTPException(status_code=403, detail="Not authorized to view this claim")
    
    return convert_claim_to_response(claim)


@router.put("/{claim_id}", response_model=ClaimResponse)
async def update_claim(
    claim_id: str,
    claim_update: ClaimUpdate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Update a claim's status or damage type"""
    result = await db.execute(select(Claim).where(Claim.id == claim_id))
    claim = result.scalar_one_or_none()
    
    if not claim:
        raise HTTPException(status_code=404, detail="Claim not found")
    
    # Only admins and agents can update claims
    if current_user.role.value not in ["admin", "agent"]:
        raise HTTPException(status_code=403, detail="Not authorized to update claims")
    
    # Update fields
    if claim_update.status:
        claim.status = claim_update.status
    if claim_update.damage_type:
        claim.damage_type = claim_update.damage_type
    if claim_update.description:
        claim.description = claim_update.description
    
    await db.commit()
    await db.refresh(claim)
    
    return convert_claim_to_response(claim)


@router.delete("/{claim_id}")
async def delete_claim(
    claim_id: str,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete a claim"""
    result = await db.execute(select(Claim).where(Claim.id == claim_id))
    claim = result.scalar_one_or_none()
    
    if not claim:
        raise HTTPException(status_code=404, detail="Claim not found")
    
    # Check ownership or admin
    if claim.claimant_id != current_user.id and current_user.role.value != "admin":
        raise HTTPException(status_code=403, detail="Not authorized to delete this claim")
    
    await db.delete(claim)
    await db.commit()
    
    return {"message": "Claim deleted successfully"}


def convert_claim_to_response(claim: Claim) -> ClaimResponse:
    """Convert Claim model to ClaimResponse schema"""
    from schemas.ai_schemas import AIAnalysisResponse, VerificationChecks
    
    # Parse images
    images = json.loads(claim.images) if claim.images else []
    
    # Convert AI analysis if present
    ai_analysis = None
    if claim.ai_analysis:
        ai_analysis = AIAnalysisResponse(
            damage_severity=claim.ai_analysis.damage_severity,
            fraud_risk=claim.ai_analysis.fraud_risk,
            confidence_score=claim.ai_analysis.confidence_score,
            is_real_image=claim.ai_analysis.is_real_image,
            verification_checks=VerificationChecks(
                gps_match=claim.ai_analysis.gps_match,
                time_match=claim.ai_analysis.time_match,
                vin_match=claim.ai_analysis.vin_match
            ),
            estimated_cost=claim.ai_analysis.estimated_cost
        )
    
    return ClaimResponse(
        id=claim.id,
        claim_number=claim.claim_number,
        claimant_id=claim.claimant_id,
        claimant_name=claim.claimant_name,
        vehicle_info=VehicleInfo(
            make=claim.vehicle_make,
            model=claim.vehicle_model,
            year=claim.vehicle_year,
            vin=claim.vehicle_vin
        ),
        incident_date=claim.incident_date,
        location=claim.location,
        description=claim.description,
        images=images,
        status=claim.status,
        damage_type=claim.damage_type,
        ai_analysis=ai_analysis,
        policy_number=claim.policy_number,
        policy_type=claim.policy_type,
        created_at=claim.created_at,
        updated_at=claim.updated_at,
        comments=[]
    )
