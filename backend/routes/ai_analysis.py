from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, Form
from typing import List
import json

from main import get_ml_model
from schemas.ai_schemas import AIAnalysisResponse
from utils.image_processor import save_upload_file, decode_base64_image

router = APIRouter()


@router.post("/fraud", response_model=AIAnalysisResponse)
async def analyze_fraud(
    image: UploadFile = File(..., description="Image file to analyze")
):
    """
    Analyze an image for fraud detection
    
    Upload an image and get AI-powered fraud analysis including:
    - Fraud risk level (low/medium/high)
    - Damage severity assessment
    - Confidence score
    - Estimated repair cost
    """
    try:
        # Get ML model
        ml_model = get_ml_model()
        if ml_model is None:
            raise HTTPException(status_code=500, detail="AI model not loaded")
        
        # Read image data
        image_data = await image.read()
        
        # Run prediction
        result = ml_model.predict_fraud(image_data)
        
        # Convert to response model
        analysis_response = AIAnalysisResponse(
            damage_severity=result["damage_severity"],
            fraud_risk=result["fraud_risk"],
            confidence_score=result["confidence_score"],
            is_real_image=result["is_real_image"],
            verification_checks=result["verification_checks"],
            estimated_cost=result["estimated_cost"]
        )
        
        return analysis_response
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing image: {str(e)}")


@router.post("/fraud/base64", response_model=AIAnalysisResponse)
async def analyze_fraud_base64(
    image_base64: str = Form(..., description="Base64 encoded image")
):
    """
    Analyze a base64 encoded image for fraud detection
    """
    try:
        # Get ML model
        ml_model = get_ml_model()
        if ml_model is None:
            raise HTTPException(status_code=500, detail="AI model not loaded")
        
        # Decode base64 image
        image_data = decode_base64_image(image_base64)
        
        # Run prediction
        result = ml_model.predict_fraud(image_data)
        
        # Convert to response model
        analysis_response = AIAnalysisResponse(
            damage_severity=result["damage_severity"],
            fraud_risk=result["fraud_risk"],
            confidence_score=result["confidence_score"],
            is_real_image=result["is_real_image"],
            verification_checks=result["verification_checks"],
            estimated_cost=result["estimated_cost"]
        )
        
        return analysis_response
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing image: {str(e)}")


@router.post("/damage", response_model=AIAnalysisResponse)
async def analyze_damage(
    image: UploadFile = File(..., description="Image file to analyze for damage")
):
    """
    Analyze an image specifically for damage assessment
    
    This endpoint focuses on determining the severity of vehicle damage
    """
    # Reuse the fraud analysis endpoint since it includes damage assessment
    return await analyze_fraud(image)


@router.post("/batch", response_model=List[AIAnalysisResponse])
async def analyze_batch(
    images: List[UploadFile] = File(..., description="Multiple images to analyze")
):
    """
    Analyze multiple images in a batch
    
    Maximum 10 images per request
    """
    if len(images) > 10:
        raise HTTPException(status_code=400, detail="Maximum 10 images per batch")
    
    try:
        # Get ML model
        ml_model = get_ml_model()
        if ml_model is None:
            raise HTTPException(status_code=500, detail="AI model not loaded")
        
        results = []
        for image in images:
            try:
                image_data = await image.read()
                result = ml_model.predict_fraud(image_data)
                
                analysis_response = AIAnalysisResponse(
                    damage_severity=result["damage_severity"],
                    fraud_risk=result["fraud_risk"],
                    confidence_score=result["confidence_score"],
                    is_real_image=result["is_real_image"],
                    verification_checks=result["verification_checks"],
                    estimated_cost=result["estimated_cost"]
                )
                results.append(analysis_response)
            except Exception as e:
                # Continue with other images even if one fails
                print(f"Error analyzing image {image.filename}: {str(e)}")
                continue
        
        return results
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error in batch analysis: {str(e)}")
