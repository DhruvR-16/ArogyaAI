import api from './api';

export const analysisService = {

  startAnalysis: async (uploadId) => {
    const response = await api.post('/api/analysis/analyze', { upload_id: uploadId });
    return response.data;
  },

  getAnalyses: async () => {
    const response = await api.get('/api/analysis/');
    return response.data;
  },

  getAnalysis: async (id) => {
    const response = await api.get(`/api/analysis/${id}`);
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/api/analysis/stats');
    return response.data;
  }
};

