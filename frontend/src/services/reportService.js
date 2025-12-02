import api from './api';

export const reportService = {

  generateReport: async (analysisId, reportType = 'summary') => {
    const response = await api.post('/api/reports/', { 
      analysis_id: analysisId, 
      report_type: reportType 
    });
    return response.data;
  },

  getReports: async () => {
    const response = await api.get('/api/reports/');
    return response.data;
  },

  getReport: async (id) => {
    const response = await api.get(`/api/reports/${id}`);
    return response.data;
  },

  deleteReport: async (id) => {
    const response = await api.delete(`/api/reports/${id}`);
    return response.data;
  }
};

