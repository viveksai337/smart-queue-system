from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
from sklearn.linear_model import LinearRegression
import pickle
import os

app = FastAPI(
    title="SQMS AI Prediction Service",
    description="AI-powered waiting time prediction for Smart Queue Management System",
    version="1.0.0",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------------- Model ---------------

class PredictionInput(BaseModel):
    queue_length: int
    avg_service_time: float  # in minutes
    active_counters: int
    is_peak_hour: bool = False
    day_of_week: int = 0  # 0=Monday, 6=Sunday
    historical_avg_wait: float = 0.0  # optional

class PredictionOutput(BaseModel):
    estimated_wait_minutes: float
    confidence: float  # 0-1
    peak_factor: float
    model_used: str

# Training: Synthetic data-based Linear Regression
# In production, this would be trained on actual queue log data

def create_model():
    """Create and train a simple linear regression model with synthetic data."""
    np.random.seed(42)
    n_samples = 1000

    # Features: queue_length, avg_service_time, active_counters, is_peak, day_of_week
    queue_lengths = np.random.randint(1, 50, n_samples)
    avg_service_times = np.random.uniform(5, 25, n_samples)
    active_counters = np.random.randint(1, 15, n_samples)
    is_peak = np.random.randint(0, 2, n_samples)
    day_of_week = np.random.randint(0, 7, n_samples)

    # Target: waiting time (with some noise)
    wait_time = (
        (queue_lengths * avg_service_times / np.maximum(active_counters, 1))
        * (1 + 0.3 * is_peak)
        * (1 + 0.1 * (day_of_week >= 5).astype(float))
        + np.random.normal(0, 2, n_samples)
    )
    wait_time = np.maximum(wait_time, 0)

    X = np.column_stack([queue_lengths, avg_service_times, active_counters, is_peak, day_of_week])
    
    model = LinearRegression()
    model.fit(X, wait_time)

    # Save model
    os.makedirs('models', exist_ok=True)
    with open('models/wait_predictor.pkl', 'wb') as f:
        pickle.dump(model, f)

    return model

# Load or create model
model_path = 'models/wait_predictor.pkl'
if os.path.exists(model_path):
    with open(model_path, 'rb') as f:
        model = pickle.load(f)
    print("✅ Model loaded from disk")
else:
    model = create_model()
    print("✅ New model trained and saved")


# --------------- Endpoints ---------------

@app.get("/")
def root():
    return {
        "service": "SQMS AI Prediction",
        "status": "running",
        "version": "1.0.0",
        "endpoints": ["/predict", "/health", "/retrain"],
    }

@app.get("/health")
def health():
    return {"status": "healthy", "model_loaded": model is not None}

@app.post("/predict", response_model=PredictionOutput)
def predict_wait_time(data: PredictionInput):
    """Predict estimated waiting time based on current queue conditions."""
    
    peak_factor = 1.3 if data.is_peak_hour else 1.0
    
    features = np.array([[
        data.queue_length,
        data.avg_service_time,
        data.active_counters,
        1 if data.is_peak_hour else 0,
        data.day_of_week,
    ]])

    predicted = model.predict(features)[0]
    predicted = max(0, round(predicted, 1))

    # Simple confidence calculation (lower when values are extreme)
    confidence = min(0.95, max(0.5, 1 - abs(data.queue_length - 15) / 50))

    # If historical data is provided, blend with prediction
    if data.historical_avg_wait > 0:
        predicted = 0.7 * predicted + 0.3 * data.historical_avg_wait
        confidence = min(confidence + 0.1, 0.95)

    return PredictionOutput(
        estimated_wait_minutes=round(predicted, 1),
        confidence=round(confidence, 2),
        peak_factor=peak_factor,
        model_used="LinearRegression_v1",
    )

@app.post("/retrain")
def retrain_model():
    """Retrain the model (in production, would use actual data from MySQL)."""
    global model
    model = create_model()
    return {"message": "Model retrained successfully", "model": "LinearRegression_v1"}

@app.post("/predict/batch")
def predict_batch(inputs: list[PredictionInput]):
    """Batch prediction for multiple queues."""
    results = []
    for data in inputs:
        features = np.array([[
            data.queue_length,
            data.avg_service_time,
            data.active_counters,
            1 if data.is_peak_hour else 0,
            data.day_of_week,
        ]])
        predicted = max(0, round(model.predict(features)[0], 1))
        results.append({
            "estimated_wait_minutes": predicted,
            "queue_length": data.queue_length,
        })
    return {"predictions": results}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
