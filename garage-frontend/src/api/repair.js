// src/api/repair.js

import axios from 'axios';
import { getItem } from '@/utils/storage';

const API_URL = 'http://localhost:5000/api/repairs';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to headers
api.interceptors.request.use(config => {
  const user = getItem('user');
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// Handle errors
api.interceptors.response.use(
  res => res.data,
  error => {
    const msg = error.response?.data?.message || 'Request failed';
    return Promise.reject(msg);
  }
);

// API functions
export const getAllRepairs = () => api.get('/');
export const getRepairById = id => api.get(`/${id}`);
export const createRepair = data => api.post('/', data);
export const updateRepair = (id, data) => api.put(`/${id}`, data);
export const deleteRepair = id => api.delete(`/${id}`);

export default {
  getAllRepairs,
  getRepairById,
  createRepair,
  updateRepair,
  deleteRepair,
};
