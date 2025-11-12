import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

export const analysisService = {

  startAnalysis: async (uploadId) => {
    const response = await axios.post(
      `${API_BASE_URL}/api/analysis/analyze`,
      { upload_id: uploadId },
      { headers: getAuthHeaders() }
    );
    return response.data;
  },


  getAnalyses: async () => {
    const response = await axios.get(
      `${API_BASE_URL}/api/analysis/`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  },


  getAnalysis: async (id) => {
    const response = await axios.get(
      `${API_BASE_URL}/api/analysis/${id}`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  },


  getStats: async () => {
    const response = await axios.get(
      `${API_BASE_URL}/api/analysis/stats`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  }
};

