# ArogyaAI – Early Disease Detection System

ArogyaAI is an AI-powered health assistant that helps users detect potential diseases early and track their medical reports securely.

---

## Key Features
- **Secure Auth:** JWT-based signup, login, and logout  
- **Upload Reports:** Add medical files or lab results for analysis  
- **AI Predictions:** Get instant insights on disease risks  
- **Dashboard:** View, filter, search, and manage reports  
- **Live Updates:** Real-time data sync across dashboard  

---

## How It Works
1. **Sign up / Log in** to your ArogyaAI account.  
2. **Upload** a medical file or image.  
3. **Get AI-based predictions** and save them as reports.  
4. **Manage reports** — rename, delete, or filter by date.  

---

## Security
- Encrypted passwords (bcrypt)  
- Token-based authentication (JWT)  
- CORS-protected API requests  

---

##  API Overview
| Endpoint | Method | Description |
|-----------|---------|--------------|
| `/api/auth/signup` | POST | Register a new user |
| `/api/auth/login` | POST | Login and get token |
| `/api/predict` | POST | Upload data/image for prediction |
| `/api/reports` | GET | View all reports (with filters) |
| `/api/reports/:id` | DELETE | Delete a report |

---

### Built for users — simple, secure, and accessible healthcare with AI.

---
Frontend URL: https://arogya-ai-nu.vercel.app/

Backend URL: https://arogyaai-gj3m.onrender.com





