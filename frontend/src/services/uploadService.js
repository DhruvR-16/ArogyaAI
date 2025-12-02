import api from './api';

export const uploadService = {
  uploadFile: async (file, fileType, description) => {
    const formData = new FormData();
    formData.append('file', file);
    if (fileType) formData.append('fileType', fileType);
    if (description) formData.append('description', description);

    const response = await api.post('/api/upload/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  getUserUploads: async () => {
    const response = await api.get('/api/upload/');
    return response.data;
  },

  getUpload: async (id) => {
    const response = await api.get(`/api/upload/${id}`);
    return response.data;
  },

  deleteUpload: async (id) => {
    const response = await api.delete(`/api/upload/${id}`);
    return response.data;
  }
};

