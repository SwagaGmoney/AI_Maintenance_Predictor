import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
import pickle
import os

def generate_dummy_data(n_samples=1000):
    np.random.seed(42)
    # Generate synthetic sensor data
    temperature = np.random.normal(60, 15, n_samples)  # Normal temp 60C
    vibration = np.random.normal(2, 1, n_samples)      # Normal vib 2mm/s
    pressure = np.random.normal(100, 10, n_samples)    # Pressure 100psi
    rpm = np.random.normal(1500, 100, n_samples)       # 1500 RPM
    
    X = np.column_stack((temperature, vibration, pressure, rpm))
    
    # Target: Failure if temp > 90 OR vibration > 5
    y = ((temperature > 85) | (vibration > 4.5)).astype(int)
    
    # Add some noise
    noise_indices = np.random.choice(n_samples, int(n_samples * 0.05), replace=False)
    y[noise_indices] = 1 - y[noise_indices]
    
    return X, y

def train():
    print("Generating dummy data...")
    X, y = generate_dummy_data()
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    print("Training Random Forest model...")
    clf = RandomForestClassifier(n_estimators=100, random_state=42)
    clf.fit(X_train, y_train)
    
    score = clf.score(X_test, y_test)
    print(f"Model Accuracy: {score:.2f}")
    
    # Save model
    output_path = os.path.join(os.path.dirname(__file__), "model.pkl")
    with open(output_path, "wb") as f:
        pickle.dump(clf, f)
    print(f"Model saved to {output_path}")

if __name__ == "__main__":
    train()
