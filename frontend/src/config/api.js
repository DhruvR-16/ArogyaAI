// API Configuration
// In production, this will use the Render backend URL
// In development, it will use localhost
// Vite exposes env variables with VITE_ prefix

const getApiBaseUrl = () => {
  // Check if we have a VITE_API_URL environment variable (for production)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Default to localhost for development
  return import.meta.env.MODE === 'production' 
    ? 'https://your-render-backend.onrender.com' // Fallback - should be set via env var
    : 'http://localhost:5050';
};

export const API_BASE_URL = getApiBaseUrl();
export const API_AUTH_URL = `${API_BASE_URL}/api/auth`;
export const API_UPLOAD_URL = `${API_BASE_URL}/api/upload`;
export const API_ANALYSIS_URL = `${API_BASE_URL}/api/analysis`;
export const API_REPORTS_URL = `${API_BASE_URL}/api/reports`;

console.log('API Base URL:', API_BASE_URL);

