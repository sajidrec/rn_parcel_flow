import apiClient from './client';
import { ROUTES } from './routes';

export const login = async (email, password) => {
  try {
    const response = await apiClient.post(
      ROUTES.AUTH.LOGIN_HUB_MANAGER,
      {
        username: email,
        password: password,
      }
    );

    return response.data;
  } catch (error) {
    console.log('Login Error:', error.response?.data || error.message);
    throw error;
  }
};