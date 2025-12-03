import pandas as pd
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.impute import SimpleImputer
import numpy as np

def clean_data(df: pd.DataFrame, target_col: str = None) -> pd.DataFrame:
    """
    Basic data cleaning: drops duplicates.
    Handling missing values is specific to datasets, so we might do it in training scripts 
    or add specific logic here. For now, we'll drop duplicates.
    """
    df = df.drop_duplicates()
    return df

def scale_features(X_train, X_test):
    """
    Scales features using StandardScaler.
    Returns scaled X_train, X_test and the scaler object.
    """
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    return X_train_scaled, X_test_scaled, scaler

def preprocess_input(input_data: dict, feature_names: list, scaler=None) -> np.array:
    """
    Preprocesses a single input dictionary for inference.
    
    Args:
        input_data (dict): Input features.
        feature_names (list): List of expected feature names in order.
        scaler: Fitted scaler object (optional).
        
    Returns:
        np.array: Preprocessed input ready for prediction (1, n_features).
    """
    # Create DataFrame to ensure correct order
    df = pd.DataFrame([input_data])
    
    # Reorder columns to match feature_names
    # Fill missing columns with 0 or mean (simple approach for inference safety)
    for col in feature_names:
        if col not in df.columns:
            df[col] = 0 # Or handle appropriately
            
    df = df[feature_names]
    
    if scaler:
        return scaler.transform(df)
    
    return df.values
