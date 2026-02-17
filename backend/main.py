from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
import os

from config import settings
from models.database import init_db
from models.ml_model import FraudDetectionModel
from routes import claims, ai_analysis, auth


# Global ML model instance
ml_model = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager"""
    global ml_model
    
    # Startup
    print("🚀 Starting up Insurance Fraud Detection API...")
    
    # Initialize database
    await init_db()
    print("✅ Database initialized")
    
    # Load ML model
    ml_model = FraudDetectionModel(settings.MODEL_PATH)
    print("✅ AI Model loaded successfully")
    
    yield
    
    # Shutdown
    print("👋 Shutting down...")


# Create FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="AI-powered insurance claim fraud detection system",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(claims.router, prefix="/api/claims", tags=["Claims"])
app.include_router(ai_analysis.router, prefix="/api/analyze", tags=["AI Analysis"])

# Mount static files for uploads
if os.path.exists(settings.UPLOAD_DIR):
    app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Insurance Fraud Detection API",
        "version": settings.APP_VERSION,
        "docs": "/docs"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "model_loaded": ml_model is not None,
        "database": "connected"
    }


# Make ml_model accessible to routes
def get_ml_model():
    return ml_model
