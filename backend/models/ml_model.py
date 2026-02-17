import numpy as np
import tensorflow as tf
from tensorflow import keras
from PIL import Image
import io
import os
from typing import Dict, Any
from config import settings


class FraudDetectionModel:
    """Fraud detection model wrapper for Keras model"""
    
    def __init__(self, model_path: str = None):
        """Initialize and load the fraud detection model"""
        self.model_path = model_path or settings.MODEL_PATH
        self.model = None
        self.load_model()
    
    def load_model(self):
        """Load the Keras model from disk"""
        try:
            if not os.path.exists(self.model_path):
                raise FileNotFoundError(f"Model file not found at {self.model_path}")
            
            self.model = keras.models.load_model(self.model_path)
            print(f"✅ Model loaded from {self.model_path}")
            print(f"   Model input shape: {self.model.input_shape}")
            print(f"   Model output shape: {self.model.output_shape}")
        except Exception as e:
            print(f"❌ Error loading model: {str(e)}")
            raise
    
    def preprocess_image(self, image_data: bytes) -> np.ndarray:
        """Preprocess image for model input"""
        try:
            # Load image from bytes
            image = Image.open(io.BytesIO(image_data))
            
            # Convert to RGB if necessary
            if image.mode != 'RGB':
                image = image.convert('RGB')
            
            # Resize to model input size
            image = image.resize(settings.IMAGE_SIZE)
            
            # Convert to numpy array
            image_array = np.array(image)
            
            # Normalize pixel values to [0, 1]
            image_array = image_array.astype('float32') / 255.0
            
            # Add batch dimension
            image_array = np.expand_dims(image_array, axis=0)
            
            return image_array
        except Exception as e:
            print(f"Error preprocessing image: {str(e)}")
            raise
    
    def predict_fraud(self, image_data: bytes) -> Dict[str, Any]:
        """
        Predict fraud probability for an image
        
        Returns:
            Dictionary with prediction results
        """
        if self.model is None:
            raise RuntimeError("Model not loaded")
        
        try:
            # Preprocess image
            processed_image = self.preprocess_image(image_data)
            
            # Get prediction
            prediction = self.model.predict(processed_image, verbose=0)
            
            # Extract prediction values
            # Assuming model outputs class probabilities
            fraud_probability = float(prediction[0][0]) if len(prediction[0]) == 1 else float(np.max(prediction[0]))
            predicted_class = int(np.argmax(prediction[0]))
            
            # Determine fraud risk level
            if fraud_probability < 0.3:
                fraud_risk = "low"
            elif fraud_probability < 0.7:
                fraud_risk = "medium"
            else:
                fraud_risk = "high"
            
            # Determine damage severity based on prediction
            # This is a simplified mapping - adjust based on your model's actual output
            if fraud_probability < 0.25:
                damage_severity = "none"
            elif fraud_probability < 0.5:
                damage_severity = "minor"
            elif fraud_probability < 0.75:
                damage_severity = "moderate"
            else:
                damage_severity = "severe"
            
            # Build analysis result
            result = {
                "fraud_risk": fraud_risk,
                "confidence_score": round(fraud_probability, 4),
                "damage_severity": damage_severity,
                "is_real_image": fraud_probability < 0.5,  # Simplified check
                "verification_checks": {
                    "gps_match": True,  # Placeholder - implement actual GPS verification
                    "time_match": True,  # Placeholder - implement actual time verification
                    "vin_match": True,  # Placeholder - implement actual VIN verification
                },
                "estimated_cost": self._estimate_cost(damage_severity),
                "raw_prediction": prediction.tolist(),
            }
            
            return result
        
        except Exception as e:
            print(f"Error during prediction: {str(e)}")
            raise
    
    def _estimate_cost(self, damage_severity: str) -> float:
        """Estimate repair cost based on damage severity"""
        cost_map = {
            "none": 0.0,
            "minor": 1500.0,
            "moderate": 5000.0,
            "severe": 15000.0,
        }
        return cost_map.get(damage_severity, 0.0)
    
    def predict_batch(self, images_data: list) -> list:
        """Predict fraud for multiple images"""
        results = []
        for image_data in images_data:
            try:
                result = self.predict_fraud(image_data)
                results.append(result)
            except Exception as e:
                results.append({"error": str(e)})
        return results
