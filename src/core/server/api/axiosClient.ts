import axios from 'axios';

// Use environment variable or default to empty string (which resolves to same origin)
const API_URL = import.meta.env.VITE_API_URL || '';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to dynamically inject the JWT token from localStorage
api.interceptors.request.use(
  (config) => {
    // Do not attach token for the login request
    if (config.url?.endsWith('/auth/login')) {
      return config;
    }

    try {
      const rawToken = localStorage.getItem('auth_token');
      if (rawToken) {
        const token = JSON.parse(rawToken);
        if (token && typeof token === 'string') {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (error) {
      console.error('Error parsing auth token in request interceptor:', error);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle session expiration (e.g. 401 Unauthorized / 403 Forbidden)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Session expired or unauthorized. Clearing credentials.');
      try {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        // We can reload the page to trigger redirect to /login
        window.location.href = '/login';
      } catch (err) {
        console.error('Error cleaning up auth on 401:', err);
      }
    }
    return Promise.reject(error);
  }
);
