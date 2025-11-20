import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros de autenticação
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const auth = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (name, email, password) => api.post('/auth/register', { name, email, password }),
  me: () => api.get('/auth/me'),
};

// Briefings
export const briefings = {
  getAll: (filters) => api.get('/briefings', { params: filters }),
  getOne: (id) => api.get(`/briefings/${id}`),
  create: (data) => api.post('/briefings', data),
  update: (id, data) => api.patch(`/briefings/${id}`, data),
  delete: (id) => api.delete(`/briefings/${id}`),
  getStatistics: () => api.get('/briefings/statistics'),
  exportExcel: (filters) =>
    api.get('/briefings/export/excel', {
      params: filters,
      responseType: 'blob',
    }),
  exportCSV: (filters) =>
    api.get('/briefings/export/csv', {
      params: filters,
      responseType: 'blob',
    }),
};

export default api;
