import os
from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """Application configuration settings"""
    
    # Application
    APP_NAME: str = "Insurance Fraud Detection API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    
    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    # CORS
    CORS_ORIGINS: list = [
        "http://localhost:5173",  # Vite dev server
        "http://localhost:3000",
        "http://127.0.0.1:5173",
    ]
    
    # Database
    DATABASE_URL: str = "sqlite+aiosqlite:///./insurance.db"
    
    # Security
    SECRET_KEY: str = "your-secret-key-change-in-production-use-openssl-rand-hex-32"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    
    # AI Model
    MODEL_PATH: str = "../cars_claim_model.keras"
    UPLOAD_DIR: str = "./uploads"
    MAX_UPLOAD_SIZE: int = 10 * 1024 * 1024  # 10MB
    
    # Image Processing
    IMAGE_SIZE: tuple = (224, 224)  # Standard size for most CNN models
    ALLOWED_EXTENSIONS: set = {"png", "jpg", "jpeg", "webp"}
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()

# Create upload directory if it doesn't exist
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
