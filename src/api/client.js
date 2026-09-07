import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
const TOKEN_KEY = import.meta.env.VITE_TOKEN_KEY;

const api = axios.create({
  baseURL: API_URL,
});

// Attach the JWT (if we have one) to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.errors?.[0]?.message ||
      error.message ||
      'Something went wrong';

    if (error.response?.status === 401 && localStorage.getItem(TOKEN_KEY)) {
      localStorage.removeItem(TOKEN_KEY);
      const isAdminArea = window.location.pathname.startsWith('/admin');
      window.location.href = isAdminArea ? '/admin' : '/login';
    }

    return Promise.reject(new Error(message));
  }
);

export default api;