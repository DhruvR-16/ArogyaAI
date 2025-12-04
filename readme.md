# ArogyaAI – Early Disease Detection System

ArogyaAI is an advanced AI-powered health assistant designed to help users detect potential diseases early, track their medical history, and manage their health schedule securely.

---

## Key Features

### Authentication & Security

- **Secure Signup/Login:** JWT-based authentication with bcrypt password hashing.
- **Protected Routes:** Middleware ensures only authenticated users access private data.

### Disease Prediction & Reports

- **AI Predictions:** Predict risk for Diabetes, Heart Disease, and Kidney Disease using ML models.
- **Report History:** View all past predictions and uploaded reports in a unified timeline.
- **Search & Filter:** Instantly search reports by ID, disease type, or notes content.
- **Personal Notes:** Add and update private notes for any report.
- **File Uploads:** Securely upload and store medical documents (PDF, Images) via Supabase Storage.

### User Profile Management

- **Personal Details:** Manage Age, Gender, Blood Group, Weight, and Height.
- **Medical History:** Record allergies and existing conditions.
- **Account Control:** Options to clear medical profile or permanently delete account.

###  Medication Reminders

- **Track Schedule:** Add daily medications with dosage and time.
- **Management:** Edit or delete medications as your prescription changes.
- **Visual List:** Clear, card-based view of your daily intake.

### AI Analysis (Coming Soon)

- **Advanced Imaging:** Interface for uploading MRI, X-Ray, and CT Scans.
- **Deep Learning:** Future integration with computer vision models for detailed image analysis.

---

## Tech Stack

- **Frontend:** React.js, Tailwind CSS, Vite
- **Backend:** Node.js, Express.js
- **Database:** Supabase (PostgreSQL)
- **Storage:** Supabase Storage
- **ML Service:** Python, FastAPI, Scikit-learn
- **Deployment:** Vercel (Frontend), Render (Backend & ML)

---


##  API Endpoints

### Auth

- `POST /api/auth/signup` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/google` - Get Google Auth URL
- `POST /api/auth/google/login` - Google Login Callback

### Reports & Prediction

- `POST /api/predict` - Generate disease prediction
- `POST /api/upload` - Upload medical report file
- `GET /api/reports` - Get all reports (predicted & uploaded)
- `PUT /api/reports/:id` - Update report notes
- `DELETE /api/reports/:id` - Delete report

### User Profile

- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile
- `DELETE /api/profile` - Clear profile or delete account

### Medications

- `GET /api/medications` - Get all medications
- `POST /api/medications` - Add medication
- `PUT /api/medications/:id` - Update medication
- `DELETE /api/medications/:id` - Delete medication

---

### Built with for accessible healthcare with AI.

---

Frontend: https://arogyaai.vercel.app/

Backend: https://arogyaai-backend.vercel.app/


