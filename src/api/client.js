import axios from 'axios';
import { API_BASE_URL } from './config';
import { getToken, logout } from '../storage/auth_storage';
import { API_ROUTES } from './routes';
import ROUTES from '../navigation/routes';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

apiClient.interceptors.request.use(
  async (config) => {
    if (config.skipAuth) {
      return config;
    }
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log('Session expired, please log in again.');

      logout();
      useNavigation().navigate(ROUTES.LOGIN);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
