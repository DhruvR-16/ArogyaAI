import axios from 'axios'
import { API_AUTH_URL } from '../config/api'

const api = axios.create({
  baseURL: API_AUTH_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
  withCredentials: false, // Set to false for Bearer token auth
})


api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    console.log('Making request to:', config.url, 'with method:', config.method)
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)


api.interceptors.response.use(
  (response) => {
    console.log('Response received:', response.status, response.data)
    return response
  },
  (error) => {
    console.error('Request error:', error.response?.status, error.response?.data || error.message)
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Please check your connection.')
    }
    if (error.response) {

      const errorMessage = error.response.data?.error || `Request failed with status ${error.response.status}`
      throw new Error(errorMessage)
    } else if (error.request) {

      throw new Error('Network error. Please check if the server is running.')
    } else {

      throw new Error(error.message || 'An unexpected error occurred')
    }
  }
)

export const authService = {
  setToken: (token) => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      delete api.defaults.headers.common['Authorization']
    }
  },

  login: async (email, password) => {
    const response = await api.post('/login', { email, password })
    return response.data
  },

  signup: async (name, email, password) => {
    const response = await api.post('/signup', { name, email, password })
    return response.data
  },

  getProfile: async () => {
    const response = await api.get('/profile')
    return response.data
  },
}
