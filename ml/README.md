# ArogyaAI - Early Disease Detection System (ML Subsystem)

This is the Machine Learning subsystem for ArogyaAI, providing disease prediction models for Diabetes, Heart Disease, and Kidney Disease. It includes training scripts, an inference engine, a FastAPI prediction server, and a Streamlit dashboard for testing.

## Folder Structure

```
ml/
├── api/                # FastAPI application
├── data/               # Datasets (CSV)
├── inference/          # Inference engine
├── models/             # Trained models and metadata
├── train_scripts/      # Model training scripts
├── utils/              # Helper utilities
├── dashboard.py        # Streamlit dashboard
└── README.md           # This file
```

## Installation

1.  **Prerequisites**: Python 3.10+
2.  **Install Dependencies**:

    ```bash
    pip install pandas numpy scikit-learn joblib fastapi uvicorn streamlit
    ```

## Training Models

To train the models, run the following scripts from the project root:

```bash
# Train Diabetes Model
python ml/train_scripts/train_diabetes.py

# Train Heart Disease Model
python ml/train_scripts/train_heart.py

# Train Kidney Disease Model
python ml/train_scripts/train_kidney.py
```

Models will be saved in `ml/models/`.

## Running the API

Start the FastAPI prediction server:

```bash
python ml/api/main.py
```

The API will be available at `http://localhost:8000`.

### API Endpoints

- **POST /predict/diabetes**
- **POST /predict/heart**
- **POST /predict/kidney**

**Example Request (Diabetes):**

```json
{
  "Pregnancies": 6,
  "Glucose": 148,
  "BloodPressure": 72,
  "SkinThickness": 35,
  "Insulin": 0,
  "BMI": 33.6,
  "DiabetesPedigreeFunction": 0.627,
  "Age": 50
}
```

**Example Response:**

```json
{
  "prediction": 1,
  "probability": 0.72,
  "risk_category": "High",
  "timestamp": "2023-10-27T10:00:00.000000"
}
```

## Running the Dashboard

Start the Streamlit dashboard for interactive testing:

```bash
streamlit run ml/dashboard.py
```

## Features

- **Diabetes Prediction**: Uses Random Forest Classifier on Pima Indians Diabetes Dataset.
- **Heart Disease Prediction**: Uses Random Forest Classifier on Heart Failure Prediction Dataset.
- **Kidney Disease Prediction**: Uses Random Forest Classifier on Chronic Kidney Disease Dataset.
- **Scalable Architecture**: Modular design with separate training, inference, and API layers.
- **Ready for Integration**: REST API allows easy integration with Node.js or other backends.
