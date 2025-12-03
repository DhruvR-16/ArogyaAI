import pandas as pd
import os

def load_data(filepath: str) -> pd.DataFrame:
    """
    Loads data from a CSV file.
    
    Args:
        filepath (str): Path to the CSV file.
        
    Returns:
        pd.DataFrame: Loaded data.
    """
    if not os.path.exists(filepath):
        raise FileNotFoundError(f"File not found: {filepath}")
    
    return pd.read_csv(filepath)
