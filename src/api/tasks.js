import apiClient from './client';
import { API_ROUTES } from './routes';

export const createTask = async (
  formData
) => {

  const response = await apiClient.post(API_ROUTES.TASKS.CREATE_TASK, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return response.data;
};