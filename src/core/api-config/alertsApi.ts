import axios, {
  type AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from 'axios';

const TOKEN_STORAGE_KEY = 'token';
const LOGIN_PATH = '/login';
// ToDo(): after we have full link we need to work with proxy by vite and fix this code.
const getApiBaseUrl = (): string => {
  return  '/alerts-api';
};

const redirectToLogin = (): void => {
  if (window.location.pathname !== LOGIN_PATH) {
    window.location.assign(LOGIN_PATH);
  }
};

export const alertsApi: AxiosInstance = axios.create({
  baseURL: getApiBaseUrl(),
});

const getAuthToken = (): string | null => {
  try {
    const rawToken = localStorage.getItem('auth_token');
    return rawToken ? JSON.parse(rawToken) : null;
  } catch {
    return null;
  }
};

alertsApi.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = getAuthToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
);

alertsApi.interceptors.response.use(
  (response) => response,
  (error: AxiosError): Promise<never> => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      redirectToLogin();
    }

    return Promise.reject(error);
  },
);

