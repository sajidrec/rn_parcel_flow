import apiClient from './client';
import { API_ROUTES } from './routes';

export const login = async (email, password) => {
  try {
    const response = await apiClient.post(
      API_ROUTES.AUTH.LOGIN_PARCEL_RIDER,
      {
        username: email,
        password: password,
      },
      { skipAuth: true }
    );

    return response.data;
  } catch (error) {
    console.log('Login Error:', error.response?.data || error.message);
    throw error;
  }
};