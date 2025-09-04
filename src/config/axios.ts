import axios from 'axios';

// Create axios instance
const axiosInstance = axios.create({
  baseURL:
    process.env.NODE_ENV === 'production'
      ? 'https://react-play.onrender.com/admin'
      : 'http://localhost:5000/admin',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

// Response interceptor to handle errors
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
