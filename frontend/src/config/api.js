
const getApiBaseUrl = () => {

  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  return import.meta.env.MODE === 'production' 
    ? 'https://arogyaai-gj3m.onrender.com'
    : 'http://localhost:5050';
};

export const API_BASE_URL = getApiBaseUrl();
export const API_AUTH_URL = `${API_BASE_URL}/api/auth`;
export const API_UPLOAD_URL = `${API_BASE_URL}/api/upload`;
export const API_ANALYSIS_URL = `${API_BASE_URL}/api/analysis`;
export const API_REPORTS_URL = `${API_BASE_URL}/api/reports`;

console.log('API Base URL:', API_BASE_URL);

