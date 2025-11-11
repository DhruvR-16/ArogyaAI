import axios from 'axios';

const API_BASE_URL = 'http://localhost:5050/api';

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
      `${API_BASE_URL}/analysis/analyze`,
      { upload_id: uploadId },
      { headers: getAuthHeaders() }
    );
    return response.data;
  },


  getAnalyses: async () => {
    const response = await axios.get(
      `${API_BASE_URL}/analysis/`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  },


  getAnalysis: async (id) => {
    const response = await axios.get(
      `${API_BASE_URL}/analysis/${id}`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  },


  getStats: async () => {
    const response = await axios.get(
      `${API_BASE_URL}/analysis/stats`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  }
};

