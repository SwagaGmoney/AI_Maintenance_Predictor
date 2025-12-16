from fastapi import APIRouter, HTTPException, UploadFile, File
from pydantic import BaseModel
import random
from typing import List
import os
import json
import numpy as np
import io
import pandas as pd
# Import our custom model
import sys
sys.path.append(os.path.join(os.path.dirname(__file__), ".."))
from ml.model import MaintenanceModel
from .database import engine, get_db, Base
from .models import PredictionLog, User
from sqlalchemy.orm import Session
from fastapi import Depends

# Create tables if they don't exist
Base.metadata.create_all(bind=engine)

router = APIRouter()

# Schema for user sync
class UserCreate(BaseModel):
    auth0_id: str
    email: str
    name: str

@router.post("/users/sync")
def sync_user(user: UserCreate, db: Session = Depends(get_db)):
    # Check if user exists
    db_user = db.query(User).filter(User.auth0_id == user.auth0_id).first()
    
    if not db_user:
        # Create new user
        db_user = User(
            auth0_id=user.auth0_id, 
            email=user.email, 
            name=user.name
        )
        db.add(db_user)
        db.commit()
    else:
        # Update existing info (optional)
        db_user.email = user.email
        db_user.name = user.name
        db.commit()
        
    return {"status": "synced", "user_id": db_user.id}

# Schema for sensor data
class SensorData(BaseModel):
    temperature: float
    vibration: float
    pressure: float
    rpm: float

class PredictionResponse(BaseModel):
    failure_probability: float
    risk_level: str

# Global model variable
model = None

def load_model():
    global model
    try:
        model_path = os.path.join(os.path.dirname(__file__), "../ml/model_weights.json")
        if os.path.exists(model_path):
            model = MaintenanceModel()
            model.load(model_path)
            print("Custom AI Model loaded successfully")
        else:
            print(f"Model file not found at {model_path}")
    except Exception as e:
        print(f"Failed to load model: {e}")

@router.on_event("startup")
async def startup_event():
    load_model()

@router.post("/predict", response_model=PredictionResponse)
def predict_failure(data: SensorData, db: Session = Depends(get_db)):
    global model
    
    # Feature vector
    features = [[data.temperature, data.vibration, data.pressure, data.rpm]]
    
    if model:
        # Predict using loaded model
        prob = float(model.predict_proba(features)[0])
    else:
        # Fallback simulation if model not trained yet
        # Higher temp/vibra -> higher risk
        risk_factor = (data.temperature / 100.0) * 0.4 + (data.vibration / 10.0) * 0.6
        prob = min(max(risk_factor * random.uniform(0.8, 1.2), 0.0), 1.0)
    
    risk_level = "Low"
    if prob > 0.7:
        risk_level = "Critical"
    elif prob > 0.4:
        risk_level = "Warning"
    
    # Save to Database
    try:
        log_entry = PredictionLog(
            temperature=data.temperature,
            vibration=data.vibration,
            pressure=data.pressure,
            rpm=data.rpm,
            failure_probability=prob,
            risk_level=risk_level
        )
        db.add(log_entry)
        db.commit()
    except Exception as e:
        print(f"Error saving to DB: {e}")
        
    return {
        "failure_probability": round(prob, 4),
        "risk_level": risk_level
    }

@router.post("/upload")
async def upload_csv(file: UploadFile = File(...)):
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files are allowed")
    
    try:
        # Read file content
        contents = await file.read()
        df = pd.read_csv(io.BytesIO(contents))
        
        if df.empty:
            return {"status": "error", "message": "CSV file is empty"}
            
        # Get first row as dictionary to populate frontend
        # Assuming columns match: temperature, vibration, pressure, rpm
        first_row = df.iloc[0].to_dict()
        
        # Ensure keys are lowercase for frontend compatibility
        data = {k.lower(): v for k, v in first_row.items()}
        
        return {
            "filename": file.filename, 
            "status": "success", 
            "message": "File uploaded successfully",
            "data": data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/metrics")
def get_metrics():
    # Mock metrics endpoint for dashboard
    return {
        "active_sensors": 45,
        "predictions_today": 1250,
        "failures_prevented": 3
    }
