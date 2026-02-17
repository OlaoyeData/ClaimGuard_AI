from PIL import Image
import io
from typing import Optional
from fastapi import UploadFile, HTTPException
import base64
import os
import uuid

from config import settings


def validate_image_file(file: UploadFile) -> bool:
    """Validate uploaded image file"""
    # Check file extension
    if not file.filename:
        return False
    
    extension = file.filename.split(".")[-1].lower()
    if extension not in settings.ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type. Allowed: {', '.join(settings.ALLOWED_EXTENSIONS)}"
        )
    
    return True


def validate_image_size(file_size: int) -> bool:
    """Validate image file size"""
    if file_size > settings.MAX_UPLOAD_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"File too large. Maximum size: {settings.MAX_UPLOAD_SIZE / 1024 / 1024}MB"
        )
    return True


async def save_upload_file(file: UploadFile) -> str:
    """Save uploaded file and return file path"""
    try:
        # Validate file
        validate_image_file(file)
        
        # Generate unique filename
        extension = file.filename.split(".")[-1].lower()
        filename = f"{uuid.uuid4()}.{extension}"
        file_path = os.path.join(settings.UPLOAD_DIR, filename)
        
        # Read and validate size
        contents = await file.read()
        validate_image_size(len(contents))
        
        # Save file
        with open(file_path, "wb") as f:
            f.write(contents)
        
        return file_path
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error saving file: {str(e)}")


def decode_base64_image(base64_string: str) -> bytes:
    """Decode base64 image string to bytes"""
    try:
        # Remove data URL prefix if present
        if "base64," in base64_string:
            base64_string = base64_string.split("base64,")[1]
        
        # Decode base64
        image_data = base64.b64decode(base64_string)
        return image_data
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid base64 image: {str(e)}")


def resize_image(image_data: bytes, size: tuple = None) -> bytes:
    """Resize image to specified size"""
    try:
        size = size or settings.IMAGE_SIZE
        
        # Open image
        image = Image.open(io.BytesIO(image_data))
        
        # Convert to RGB if necessary
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Resize
        image = image.resize(size, Image.Resampling.LANCZOS)
        
        # Save to bytes
        output = io.BytesIO()
        image.save(output, format='JPEG', quality=85)
        return output.getvalue()
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error processing image: {str(e)}")
