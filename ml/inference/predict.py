import joblib
import os
import json
import numpy as np
import sys

# Add project root to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from utils.preprocessing import preprocess_input

class DiseasePredictor:
    def __init__(self):
        self.models = {}
        self.scalers = {}
        self.imputers = {} # For kidney model
        self.metadata = {}
        self.models_dir = os.path.join(os.path.dirname(__file__), '../models')
        
    def load_model(self, disease_name: str):
        """
        Loads model, scaler, and metadata for a specific disease if not already loaded.
        """
        if disease_name in self.models:
            return
            
        try:
            # Load Model
            model_path = os.path.join(self.models_dir, f'{disease_name}_model.joblib')
            self.models[disease_name] = joblib.load(model_path)
            
            # Load Scaler
            scaler_path = os.path.join(self.models_dir, f'{disease_name}_scaler.joblib')
            self.scalers[disease_name] = joblib.load(scaler_path)
            
            # Load Imputer if exists (Kidney)
            imputer_path = os.path.join(self.models_dir, f'{disease_name}_imputer.joblib')
            if os.path.exists(imputer_path):
                self.imputers[disease_name] = joblib.load(imputer_path)
            
            # Load Metadata
            metadata_path = os.path.join(self.models_dir, f'{disease_name}_metadata.json')
            with open(metadata_path, 'r') as f:
                self.metadata[disease_name] = json.load(f)
                
        except FileNotFoundError as e:
            raise FileNotFoundError(f"Model files for {disease_name} not found. Please train the model first.") from e

    def predict(self, disease_name: str, input_data: dict):
        """
        Makes a prediction for the specified disease.
        
        Args:
            disease_name (str): 'diabetes', 'heart', or 'kidney'.
            input_data (dict): Dictionary of input features.
            
        Returns:
            dict: Prediction result.
        """
        self.load_model(disease_name)
        
        feature_names = self.metadata[disease_name]['features']
        
        # Preprocess
        # Special handling for Kidney which might need imputation before scaling if we were doing raw inference
        # But our preprocessing utility handles scaling.
        # For kidney, we need to handle imputation potentially.
        # Let's use the utility but we might need to adapt it if we have an imputer.
        
        # Construct array in correct order
        import pandas as pd
        df = pd.DataFrame([input_data])
        
        # Ensure all columns exist
        for col in feature_names:
            if col not in df.columns:
                 df[col] = 0 # Default or raise error
        
        df = df[feature_names]
        
        # Impute if needed
        if disease_name in self.imputers:
            data_values = self.imputers[disease_name].transform(df)
        else:
            data_values = df.values
            
        # Scale
        data_scaled = self.scalers[disease_name].transform(data_values)
        
        # Predict
        prediction = self.models[disease_name].predict(data_scaled)[0]
        probability = self.models[disease_name].predict_proba(data_scaled)[0][1]
        
        # Risk Category
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

# Singleton instance
predictor = DiseasePredictor()
