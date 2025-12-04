import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {

      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);



export const predictDisease = async (disease, data) => {
  const response = await api.post(`/api/predict?disease=${disease}`, data);
  return response.data;
};

export const uploadReport = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/api/upload-report', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getReports = async () => {
  const response = await api.get('/api/reports');
  return response.data;
};

export const deleteReport = async (id) => {
  const response = await api.delete(`/api/reports/${id}`);
  return response.data;
};

export const updateReport = async (id, data) => {
  const response = await api.put(`/api/reports/${id}`, data);
  return response.data;
};

export const getUploadedReports = async () => {
  const response = await api.get('/api/uploaded-reports');
  return response.data;
};

export default api;
