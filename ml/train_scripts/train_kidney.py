import pandas as pd
import joblib
import json
import os
import sys
import numpy as np

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from utils.data_loader import load_data
from utils.preprocessing import clean_data, scale_features
from utils.evaluation import evaluate_model
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.impute import SimpleImputer

def train():
    print("Training Kidney Disease Model...")
    

    data_path = os.path.join(os.path.dirname(__file__), '../data/kidney_disease.csv')
    df = load_data(data_path)
    


    df['classification'] = df['classification'].astype(str).apply(lambda x: x.strip())
    df['classification'] = df['classification'].replace('ckd\t', 'ckd')
    

    df['classification'] = df['classification'].map({'ckd': 1, 'notckd': 0})
    

    df = df.dropna(subset=['classification'])
    feature_cols = ['age', 'bp', 'bgr', 'bu', 'sc', 'hemo', 'pcv', 'wc', 'rc']
    
    for col in feature_cols:
        df[col] = pd.to_numeric(df[col], errors='coerce')
        
    X = df[feature_cols]
    y = df['classification']
    

    imputer = SimpleImputer(strategy='mean')
    X_imputed = imputer.fit_transform(X)
    

    X_train, X_test, y_train, y_test = train_test_split(X_imputed, y, test_size=0.2, random_state=42)
    
    X_train_scaled, X_test_scaled, scaler = scale_features(X_train, X_test)

    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train_scaled, y_train)

    y_pred = model.predict(X_test_scaled)
    y_prob = model.predict_proba(X_test_scaled)[:, 1]
    evaluate_model(y_test, y_pred, y_prob)

    models_dir = os.path.join(os.path.dirname(__file__), '../models')
    os.makedirs(models_dir, exist_ok=True)
    
    joblib.dump(model, os.path.join(models_dir, 'kidney_model.joblib'))
    joblib.dump(scaler, os.path.join(models_dir, 'kidney_scaler.joblib'))
    joblib.dump(imputer, os.path.join(models_dir, 'kidney_imputer.joblib'))
    
    metadata = {
        'features': feature_cols,
        'target_classes': ['Not CKD', 'CKD']
    }
    with open(os.path.join(models_dir, 'kidney_metadata.json'), 'w') as f:
        json.dump(metadata, f)
        
    print("Kidney Disease Model Saved!")

if __name__ == "__main__":
    train()
