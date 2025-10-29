import axios from 'axios';
import { getToken, clearToken } from '../store/auth';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' }
});

// (optional) debug once:
console.log('API baseURL =', baseURL);

// attach token if present
api.interceptors.request.use((config) => {
  const t = getToken();
  if (t) config.headers.Authorization = `Bearer ${t}`;
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401 && !window.location.pathname.includes('/signin')) {
      clearToken();
      window.location.href = '/signin';
    }
    return Promise.reject(err);
  }
);

export default api;
