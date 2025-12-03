from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from datetime import datetime
import os
import sys

# Add project root to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from inference.predict import predictor

app = FastAPI(title="ArogyaAI Disease Prediction API", version="1.0.0")

# Input Schemas
class DiabetesInput(BaseModel):
    Pregnancies: int
    Glucose: int
    BloodPressure: int
    SkinThickness: int
    Insulin: int
    BMI: float
    DiabetesPedigreeFunction: float
    Age: int

class HeartInput(BaseModel):
    Age: int
    RestingBP: int
    Cholesterol: int
    FastingBS: int
    MaxHR: int
    Oldpeak: float

class KidneyInput(BaseModel):
    age: float
    bp: float
    bgr: float
    bu: float
    sc: float
    hemo: float
    pcv: float
    wc: float
    rc: float

# Response Schema
class PredictionResponse(BaseModel):
    prediction: int
    probability: float
    risk_category: str
    timestamp: str

@app.get("/")
def read_root():
    return {"message": "Welcome to ArogyaAI Prediction API"}

@app.post("/predict/diabetes", response_model=PredictionResponse)
def predict_diabetes(data: DiabetesInput):
    try:
        result = predictor.predict('diabetes', data.dict())
        result['timestamp'] = datetime.now().isoformat()
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/predict/heart", response_model=PredictionResponse)
def predict_heart(data: HeartInput):
    try:
        result = predictor.predict('heart', data.dict())
        result['timestamp'] = datetime.now().isoformat()
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/predict/kidney", response_model=PredictionResponse)
def predict_kidney(data: KidneyInput):
    try:
        result = predictor.predict('kidney', data.dict())
        result['timestamp'] = datetime.now().isoformat()
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
