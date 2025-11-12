import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

export const reportService = {

  generateReport: async (analysisId, reportType = 'summary') => {
    const response = await axios.post(
      `${API_BASE_URL}/api/reports/`,
      { analysis_id: analysisId, report_type: reportType },
      { headers: getAuthHeaders() }
    );
    return response.data;
  },


  getReports: async () => {
    const response = await axios.get(
      `${API_BASE_URL}/api/reports/`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  },


  getReport: async (id) => {
    const response = await axios.get(
      `${API_BASE_URL}/api/reports/${id}`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  },


  deleteReport: async (id) => {
    const response = await axios.delete(
      `${API_BASE_URL}/api/reports/${id}`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  }
};

