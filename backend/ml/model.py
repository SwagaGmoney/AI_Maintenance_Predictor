import numpy as np
import json
import os

class MaintenanceModel:
    def __init__(self):
        self.weights = None
        self.bias = None
        self.mean = None
        self.std = None
        
    def sigmoid(self, x):
        return 1 / (1 + np.exp(-x))
    
    def train(self, X, y, epochs=1000, learning_rate=0.01):
        # Normalize data
        self.mean = np.mean(X, axis=0)
        self.std = np.std(X, axis=0)
        X_scaled = (X - self.mean) / (self.std + 1e-8)
        
        n_samples, n_features = X.shape
        self.weights = np.zeros(n_features)
        self.bias = 0
        
        # Gradient Descent
        for _ in range(epochs):
            linear_model = np.dot(X_scaled, self.weights) + self.bias
            y_predicted = self.sigmoid(linear_model)
            
            # Gradients
            dw = (1 / n_samples) * np.dot(X_scaled.T, (y_predicted - y))
            db = (1 / n_samples) * np.sum(y_predicted - y)
            
            # Update
            self.weights -= learning_rate * dw
            self.bias -= learning_rate * db
            
    def predict_proba(self, X):
        if self.weights is None:
            raise Exception("Model not trained")
            
        X = np.array(X)
        X_scaled = (X - self.mean) / (self.std + 1e-8)
        linear_model = np.dot(X_scaled, self.weights) + self.bias
        return self.sigmoid(linear_model)
        
    def save(self, filepath):
        data = {
            "weights": self.weights.tolist(),
            "bias": self.bias,
            "mean": self.mean.tolist(),
            "std": self.std.tolist()
        }
        with open(filepath, 'w') as f:
            json.dump(data, f)
            
    def load(self, filepath):
        with open(filepath, 'r') as f:
            data = json.load(f)
        self.weights = np.array(data['weights'])
        self.bias = data['bias']
        self.mean = np.array(data['mean'])
        self.std = np.array(data['std'])
