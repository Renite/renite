import axios from 'axios';

// Create the axios instance
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true, // if using cookies/sessions
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional: Request interceptor to attach JWT tokens if stored in localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Also provide a default export so both import styles work seamlessly
export default api;