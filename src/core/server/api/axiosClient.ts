import axios from 'axios';

const API_URL = '/alerts-api' ;

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginRequest = error.config?.url?.endsWith('/auth/login');
    if (error.response?.status === 401 && !isLoginRequest) {
      console.warn('Session expired or unauthorized. Clearing credentials.');
      try {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        window.location.href = '/login';
      } catch (err) {
        console.error('Error cleaning up auth on 401:', err);
      }
    }
    return Promise.reject(error);
  }
);
