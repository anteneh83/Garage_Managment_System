// src/api/technician.js

import axios from 'axios';
import { getItem } from '@/utils/storage';

const BASE_URL = 'http://localhost:5000/api/technicians';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token to requests
api.interceptors.request.use((config) => {
  const user = getItem('user');
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// Global error handling
api.interceptors.response.use(
  (res) => res.data,
  (err) => Promise.reject(err.response?.data?.message || 'API Error')
);

export const registerTechnician = (data) => api.post('/register', data);
export const loginTechnician = (data) => api.post('/login', data);
export const getAllTechnicians = () => api.get('/');
export const getTechnicianById = (id) => api.get(`/${id}`);

export default {
  registerTechnician,
  loginTechnician,
  getAllTechnicians,
  getTechnicianById,
};
