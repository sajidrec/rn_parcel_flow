import axios from 'axios';
import { API_BASE_URL } from './config';
import { getToken, logout } from '../storage/auth_storage';
import ROUTES from '../navigation/routes';
import { navigationRef } from '../navigation/AppNavigator';

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
  async (error) => {
    if (error.response?.status === 401 && !error?.config?.skipAuth) {
      console.log('Session expired, please log in again.');

      await logout();

      if (navigationRef.isReady()) {
        navigationRef.reset({
          index: 0,
          routes: [{ name: ROUTES.LOGIN }],
        });
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
