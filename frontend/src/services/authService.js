import api from './api';

export const authService = {
  // setToken is no longer needed as the api interceptor reads from localStorage automatically
  setToken: (token) => {
    // No-op or removed
  },

  login: async (email, password) => {
    const response = await api.post('/api/auth/login', { email, password });
    return response.data;
  },

  signup: async (name, email, password) => {
    const response = await api.post('/api/auth/signup', { name, email, password });
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/api/auth/profile');
    return response.data;
  },
};
