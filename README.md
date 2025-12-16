# AI Predictive Maintenance System

A full-stack enterprise-grade application for real-time equipment monitoring and failure prediction. This system utilizes a custom Neural Network to analyze sensor data (Temperature, Vibration, Pressure, RPM) and predict potential equipment failures before they happen.

## 🚀 Key Features

*   **Custom AI Engine**: Built from scratch using NumPy, achieving **89% accuracy** on synthetic validation data.
*   **Real-time Dashboard**: Glassmorphism-styled React UI for monitoring sensor inputs and risk levels.
*   **Infrastructure-as-Code**: Fully containerized backend services using Docker (TimescaleDB, Kafka, MLflow, MinIO).
*   **Secure Authentication**: Enterprise-grade login via **Auth0** with automatic user profile synchronization to the local database.
*   **Historical Data**: All predictions and user profiles are persisted to a PostgreSQL (TimescaleDB) database for audit trails.
*   **Batch Processing**: CSV upload capability for analyzing bulk historical sensor data.

---

## 🏗️ Architecture

*   **Frontend**: React, Vite, CSS Modules (Glassmorphism).
*   **Backend**: Python, FastAPI, SQLAlchemy.
*   **Machine Learning**: Custom Single-Layer Neural Network (Logistic Regression) with Gradient Descent training.
*   **Database**: PostgreSQL (TimescaleDB) for storing User Profiles and Prediction Logs.

---

## 🛠️ Prerequisites

*   **Node.js** (v18+)
*   **Python** (v3.10+)
*   **Docker & Docker Compose** (Required for Database)

---

## 🏁 Getting Started

### 1. Start Infrastructure
Run the following command to spin up the database and supporting services:
```bash
docker-compose up -d
```

### 2. Backend Setup
The backend handles the ML inference and database connections.
```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Run the API server
uvicorn main:app --reload
```
*   API runs at: `http://localhost:8000`
*   Swagger Docs: `http://localhost:8000/docs`

### 3. Frontend Setup
The frontend requires Auth0 configuration to function.

**Configuration:**
1.  Create a Single Page Application in [Auth0 Dashboard](https://manage.auth0.com/).
2.  Rename `frontend/.env.example` to `frontend/.env` (or create it).
3.  Add your keys:
    ```env
    VITE_AUTH0_DOMAIN=your-domain.us.auth0.com
    VITE_AUTH0_CLIENT_ID=your-client-id
    ```

**Run Dashboard:**
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```
*   App runs at: `http://localhost:3000`

---

## 🧪 Usage Guide

1.  **Log In**: Use the "Log In" button. You will be redirected to Auth0.
2.  **Monitor**: Once logged in, your profile is synced to the database.
3.  **Predict**:
    *   **Manual**: Adjust the sliders for Temperature/Vibration and click "Analyze Risk".
    *   **Batch**: Upload the provided `test_data.csv` to populate fields automatically.
4.  **Verify**: Check your Database interface; new rows are added to the `predictions` and `users` tables.

---

## 🧠 ML Model Details

*   **Type**: Logistic Regression (Single Layer Neural Network with Sigmoid Activation).
*   **Training**: Trained on 2,000 synthetic samples using Gradient Descent.
*   **Logic**: High Temperature (>85°C) OR High Vibration (>4.5mm/s) significantly increases failure probability.
