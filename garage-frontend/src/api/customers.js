// src/api/customers.js

import axios from 'axios';
import { getItem } from '@/utils/storage';

const API_URL = 'http://localhost:5000/api/customers';

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
export const getAllCustomers = () => api.get('/');
export const getCustomerById = id => api.get(`/${id}`);
export const createCustomer = data => api.post('/', data);
export const updateCustomer = (id, data) => api.put(`/${id}`, data);
export const deleteCustomer = id => api.delete(`/${id}`);

export default {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
};
