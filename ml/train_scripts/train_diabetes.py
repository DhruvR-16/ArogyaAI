import pandas as pd
import joblib
import json
import os
import sys

# Add project root to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from utils.data_loader import load_data
from utils.preprocessing import clean_data, scale_features
from utils.evaluation import evaluate_model
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier

def train():
    print("Training Diabetes Model...")
    
    # Load Data
    data_path = os.path.join(os.path.dirname(__file__), '../data/diabetes.csv')
    df = load_data(data_path)
    
    # Clean
    df = clean_data(df)
    
    # Features and Target
    X = df.drop('Outcome', axis=1)
    y = df['Outcome']
    
    # Split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Scale
    X_train_scaled, X_test_scaled, scaler = scale_features(X_train, X_test)
    
    # Train
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train_scaled, y_train)
    
    # Evaluate
    y_pred = model.predict(X_test_scaled)
    y_prob = model.predict_proba(X_test_scaled)[:, 1]
    evaluate_model(y_test, y_pred, y_prob)
    
    # Save Model and Scaler
    models_dir = os.path.join(os.path.dirname(__file__), '../models')
    os.makedirs(models_dir, exist_ok=True)
    
    joblib.dump(model, os.path.join(models_dir, 'diabetes_model.joblib'))
    joblib.dump(scaler, os.path.join(models_dir, 'diabetes_scaler.joblib'))
    
    # Save Metadata
    metadata = {
        'features': list(X.columns),
        'target_classes': ['No Diabetes', 'Diabetes']
    }
    with open(os.path.join(models_dir, 'diabetes_metadata.json'), 'w') as f:
        json.dump(metadata, f)
        
    print("Diabetes Model Saved!")

if __name__ == "__main__":
    train()
