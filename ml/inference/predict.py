import joblib
import os
import json
import numpy as np
import sys
import pandas as pd


sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from utils.preprocessing import preprocess_input

class DiseasePredictor:
    def __init__(self):
        self.models = {}
        self.scalers = {}
        self.imputers = {}
        self.metadata = {}
        self.models_dir = os.path.join(os.path.dirname(__file__), '../models')
        
    def load_model(self, disease_name: str):
        if disease_name in self.models:
            return
            
        try:
            model_path = os.path.join(self.models_dir, f'{disease_name}_model.joblib')
            self.models[disease_name] = joblib.load(model_path)
            
            scaler_path = os.path.join(self.models_dir, f'{disease_name}_scaler.joblib')
            self.scalers[disease_name] = joblib.load(scaler_path)
            
            imputer_path = os.path.join(self.models_dir, f'{disease_name}_imputer.joblib')
            if os.path.exists(imputer_path):
                self.imputers[disease_name] = joblib.load(imputer_path)
            

            metadata_path = os.path.join(self.models_dir, f'{disease_name}_metadata.json')
            with open(metadata_path, 'r') as f:
                self.metadata[disease_name] = json.load(f)
                
        except FileNotFoundError as e:
            raise FileNotFoundError(f"Model files for {disease_name} not found. Please train the model first.") from e

    def predict(self, disease_name: str, input_data: dict):
        self.load_model(disease_name)
        
        feature_names = self.metadata[disease_name]['features']
        df = pd.DataFrame([input_data])
        
        for col in feature_names:
            if col not in df.columns:
                 df[col] = 0 
        
        df = df[feature_names]
    
        if disease_name in self.imputers:
            data_values = self.imputers[disease_name].transform(df)
        else:
            data_values = df.values
            
        data_scaled = self.scalers[disease_name].transform(data_values)
        
        prediction = self.models[disease_name].predict(data_scaled)[0]
        probability = self.models[disease_name].predict_proba(data_scaled)[0][1]
        
        if probability < 0.3:
            risk = "Low"
        elif probability < 0.7:
            risk = "Medium"
        else:
            risk = "High"
            
        return {
            "prediction": int(prediction),
            "probability": float(probability),
            "risk_category": risk
        }

predictor = DiseasePredictor()
