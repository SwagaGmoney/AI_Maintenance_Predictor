import numpy as np
import os
import sys

# Add parent directory to path so we can import local modules if needed, 
# but here we just need the model class which is in the same directory
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from ml.model import MaintenanceModel

def generate_data(n_samples=1000):
    np.random.seed(42)
    # Generate synthetic sensor data
    # Features: temperature, vibration, pressure, rpm
    
    temperature = np.random.normal(60, 15, n_samples)  # Normal temp 60C
    vibration = np.random.normal(2, 1, n_samples)      # Normal vib 2mm/s
    pressure = np.random.normal(100, 10, n_samples)    # Pressure 100psi
    rpm = np.random.normal(1500, 100, n_samples)       # 1500 RPM
    
    # Target Logic:
    # High Temp (>85) OR High Vibration (>4.5) => Failure (1)
    # Also combination of medium-high temp and vibration increases risk
    
    risk_score = (temperature / 100) * 0.4 + (vibration / 5) * 0.5 + np.random.normal(0, 0.1, n_samples)
    y = (risk_score > 0.6).astype(int)
    
    X = np.column_stack((temperature, vibration, pressure, rpm))
    return X, y

def train_and_save():
    print("Generating training data...")
    X, y = generate_data(2000)
    
    print("Initializing Custom Neural Network...")
    model = MaintenanceModel()
    
    print("Training (Gradient Descent)...")
    model.train(X, y, epochs=5000, learning_rate=0.1)
    
    # Evaluate
    probs = model.predict_proba(X)
    preds = (probs > 0.5).astype(int)
    accuracy = np.mean(preds == y)
    print(f"Training Accuracy: {accuracy:.2f}")
    
    # Save
    output_path = os.path.join(os.path.dirname(__file__), "model_weights.json")
    model.save(output_path)
    print(f"Model saved to {output_path}")

if __name__ == "__main__":
    train_and_save()
