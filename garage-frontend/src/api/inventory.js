import axios from 'axios';
import { getItem } from '@/utils/storage';

const API_URL = 'http://localhost:5000/api/inventory';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(config => {
  const user = getItem('user');
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

api.interceptors.response.use(
  res => res.data,
  error => {
    const msg = error.response?.data?.message || 'Request failed';
    return Promise.reject(msg);
  }
);

export const getAllItems = () => api.get('/');
export const createItem = data => api.post('/', data);
export const updateItem = (id, data) => api.put(`/${id}`, data);
export const deleteItem = id => api.delete(`/${id}`);

export default {
  getAllItems,
  createItem,
  updateItem,
  deleteItem,
};
