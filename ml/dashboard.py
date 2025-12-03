import streamlit as st
import requests
import json

# Configuration
API_URL = "http://localhost:8000"

st.set_page_config(page_title="ArogyaAI Dashboard", layout="wide")

st.title("ArogyaAI - Early Disease Detection System")
st.markdown("### ML Subsystem Test Dashboard")

# Sidebar for Navigation
disease_choice = st.sidebar.selectbox("Select Disease Model", ["Diabetes", "Heart Disease", "Kidney Disease"])

if disease_choice == "Diabetes":
    st.header("Diabetes Prediction")
    
    col1, col2 = st.columns(2)
    
    with col1:
        pregnancies = st.number_input("Pregnancies", min_value=0, value=1)
        glucose = st.number_input("Glucose", min_value=0, value=120)
        blood_pressure = st.number_input("Blood Pressure", min_value=0, value=70)
        skin_thickness = st.number_input("Skin Thickness", min_value=0, value=20)
        
    with col2:
        insulin = st.number_input("Insulin", min_value=0, value=79)
        bmi = st.number_input("BMI", min_value=0.0, value=32.0)
        dpf = st.number_input("Diabetes Pedigree Function", min_value=0.0, value=0.5)
        age = st.number_input("Age", min_value=0, value=33)
        
    if st.button("Predict Diabetes Risk"):
        payload = {
            "Pregnancies": pregnancies,
            "Glucose": glucose,
            "BloodPressure": blood_pressure,
            "SkinThickness": skin_thickness,
            "Insulin": insulin,
            "BMI": bmi,
            "DiabetesPedigreeFunction": dpf,
            "Age": age
        }
        
        try:
            response = requests.post(f"{API_URL}/predict/diabetes", json=payload)
            if response.status_code == 200:
                result = response.json()
                st.success(f"Prediction: {'Diabetes' if result['prediction'] == 1 else 'No Diabetes'}")
                st.info(f"Probability: {result['probability']:.2f}")
                st.warning(f"Risk Category: {result['risk_category']}")
            else:
                st.error(f"Error: {response.text}")
        except Exception as e:
            st.error(f"Connection Error: {e}")

elif disease_choice == "Heart Disease":
    st.header("Heart Disease Prediction")
    
    col1, col2 = st.columns(2)
    
    with col1:
        age = st.number_input("Age", min_value=0, value=40)
        resting_bp = st.number_input("Resting BP", min_value=0, value=130)
        cholesterol = st.number_input("Cholesterol", min_value=0, value=200)
        
    with col2:
        fasting_bs = st.selectbox("Fasting BS > 120 mg/dl", [0, 1])
        max_hr = st.number_input("Max HR", min_value=0, value=150)
        oldpeak = st.number_input("Oldpeak", value=0.0)
        
    if st.button("Predict Heart Disease Risk"):
        payload = {
            "Age": age,
            "RestingBP": resting_bp,
            "Cholesterol": cholesterol,
            "FastingBS": fasting_bs,
            "MaxHR": max_hr,
            "Oldpeak": oldpeak
        }
        
        try:
            response = requests.post(f"{API_URL}/predict/heart", json=payload)
            if response.status_code == 200:
                result = response.json()
                st.success(f"Prediction: {'Heart Disease' if result['prediction'] == 1 else 'Normal'}")
                st.info(f"Probability: {result['probability']:.2f}")
                st.warning(f"Risk Category: {result['risk_category']}")
            else:
                st.error(f"Error: {response.text}")
        except Exception as e:
            st.error(f"Connection Error: {e}")

elif disease_choice == "Kidney Disease":
    st.header("Kidney Disease Prediction")
    
    col1, col2, col3 = st.columns(3)
    
    with col1:
        age = st.number_input("Age", min_value=0.0, value=48.0)
        bp = st.number_input("Blood Pressure", min_value=0.0, value=80.0)
        bgr = st.number_input("Blood Glucose Random", min_value=0.0, value=121.0)
        
    with col2:
        bu = st.number_input("Blood Urea", min_value=0.0, value=36.0)
        sc = st.number_input("Serum Creatinine", min_value=0.0, value=1.2)
        hemo = st.number_input("Hemoglobin", min_value=0.0, value=15.4)
        
    with col3:
        pcv = st.number_input("Packed Cell Volume", min_value=0.0, value=44.0)
        wc = st.number_input("White Blood Cell Count", min_value=0.0, value=7800.0)
        rc = st.number_input("Red Blood Cell Count", min_value=0.0, value=5.2)
        
    if st.button("Predict Kidney Disease Risk"):
        payload = {
            "age": age,
            "bp": bp,
            "bgr": bgr,
            "bu": bu,
            "sc": sc,
            "hemo": hemo,
            "pcv": pcv,
            "wc": wc,
            "rc": rc
        }
        
        try:
            response = requests.post(f"{API_URL}/predict/kidney", json=payload)
            if response.status_code == 200:
                result = response.json()
                st.success(f"Prediction: {'CKD' if result['prediction'] == 1 else 'Not CKD'}")
                st.info(f"Probability: {result['probability']:.2f}")
                st.warning(f"Risk Category: {result['risk_category']}")
            else:
                st.error(f"Error: {response.text}")
        except Exception as e:
            st.error(f"Connection Error: {e}")
