import pandas as pd
import joblib
import json
import os
import sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from utils.data_loader import load_data
from utils.preprocessing import clean_data, scale_features
from utils.evaluation import evaluate_model
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier

def train():
    print("Training Heart Disease Model...")
    

    data_path = os.path.join(os.path.dirname(__file__), '../data/heart.csv')
    df = load_data(data_path)
    
    # Clean
    df = clean_data(df)
    


    numeric_features = ['Age', 'RestingBP', 'Cholesterol', 'FastingBS', 'MaxHR', 'Oldpeak']
    target = 'HeartDisease'
    
    X = df[numeric_features]
    y = df[target]
    

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    

    X_train_scaled, X_test_scaled, scaler = scale_features(X_train, X_test)
    

    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train_scaled, y_train)
    

    y_pred = model.predict(X_test_scaled)
    y_prob = model.predict_proba(X_test_scaled)[:, 1]
    evaluate_model(y_test, y_pred, y_prob)


    models_dir = os.path.join(os.path.dirname(__file__), '../models')
    os.makedirs(models_dir, exist_ok=True)
    
    joblib.dump(model, os.path.join(models_dir, 'heart_model.joblib'))
    joblib.dump(scaler, os.path.join(models_dir, 'heart_scaler.joblib'))
    

    metadata = {
        'features': numeric_features,
        'target_classes': ['Normal', 'Heart Disease']
    }
    with open(os.path.join(models_dir, 'heart_metadata.json'), 'w') as f:
        json.dump(metadata, f)
        
    print("Heart Disease Model Saved!")

if __name__ == "__main__":
    train()
