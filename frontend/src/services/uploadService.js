import axios from 'axios';

const API_BASE_URL = 'http://localhost:5050/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

export const uploadService = {
  uploadFile: async (file, fileType, description) => {
    const formData = new FormData();
    formData.append('file', file);
    if (fileType) formData.append('fileType', fileType);
    if (description) formData.append('description', description);

    const token = localStorage.getItem('token');
    
    const response = await axios.post(
      `${API_BASE_URL}/upload/upload`,
      formData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    return response.data;
  },


  getUserUploads: async () => {
    const response = await axios.get(
      `${API_BASE_URL}/upload/`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  },


  getUpload: async (id) => {
    const response = await axios.get(
      `${API_BASE_URL}/upload/${id}`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  },


  deleteUpload: async (id) => {
    const response = await axios.delete(
      `${API_BASE_URL}/upload/${id}`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  }
};

