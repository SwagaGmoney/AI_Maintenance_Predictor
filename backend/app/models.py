from sqlalchemy import Column, Integer, Float, String, DateTime
from datetime import datetime
from .database import Base

class PredictionLog(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    
    # Input Features
    temperature = Column(Float)
    vibration = Column(Float)
    pressure = Column(Float)
    rpm = Column(Float)
    
    # Output
    failure_probability = Column(Float)
    risk_level = Column(String)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    auth0_id = Column(String, unique=True, index=True)
    email = Column(String, index=True)
    name = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
