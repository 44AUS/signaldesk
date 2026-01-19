// API Service for SignalDesk AI
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// Configure your backend URL here
const API_BASE_URL = 'https://your-backend-url.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - clear token and redirect to login
      SecureStore.deleteItemAsync('authToken');
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// Signal endpoints
export const signalsAPI = {
  generate: (data) => api.post('/signals/generate', data),
  getAll: (limit = 20) => api.get(`/signals?limit=${limit}`),
  getOne: (id) => api.get(`/signals/${id}`),
  updateStatus: (id, status) => api.patch(`/signals/${id}/status?status=${status}`),
};

// Performance endpoints
export const performanceAPI = {
  get: () => api.get('/performance'),
};

// Subscription endpoints
export const subscriptionAPI = {
  get: () => api.get('/subscription'),
  activate: (data) => api.post('/subscription/activate', data),
  cancel: () => api.post('/subscription/cancel'),
};

// Dashboard endpoints
export const dashboardAPI = {
  get: () => api.get('/dashboard'),
};

// Assets endpoint
export const assetsAPI = {
  get: () => api.get('/assets'),
};

// Health check
export const healthAPI = {
  check: () => api.get('/health'),
};

export default api;
