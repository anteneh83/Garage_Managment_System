// src/api/vehicles.js

import axios from 'axios';
import { getItem } from '@/utils/storage';

const API_URL = 'http://localhost:5000/api/vehicles';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Inject token
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

// API Functions
export const getAllVehicles = () => api.get('/');
export const getVehicleById = (id) => api.get(`/${id}`);
export const createVehicle = (data) => api.post('/', data);
export const updateVehicle = (id, data) => api.put(`/${id}`, data);
export const deleteVehicle = (id) => api.delete(`/${id}`);

export default {
  getAllVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
};
