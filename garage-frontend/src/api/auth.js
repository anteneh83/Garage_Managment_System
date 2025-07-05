import axios from 'axios';
import { getItem, setItem, removeItem } from '@/utils/storage';

const API_URL = 'http://localhost:5000/api/auth';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

api.interceptors.request.use(config => {
  const user = getItem('user');
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

api.interceptors.response.use(
  response => response.data,
  error => {
    const errorMessage = error.response?.data?.error || 
                         error.response?.data?.message || 
                         error.message || 
                         'Request failed';
    return Promise.reject(errorMessage);
  }
);

export const register = async (userData) => {
  const response = await api.post('/register', userData);
  if (response.token) {
    setItem('user', response);
  }
  return response;
};

export const login = async (userData) => {
  const response = await api.post('/login', userData);
  if (response.token) {
    setItem('user', response);
  }
  return response;
};

export const logout = () => {
  removeItem('user');
};

export const getCurrentUser = () => {
  return getItem('user');
};
