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

export const getTaskList = async () => {
  const response = await apiClient.get(API_ROUTES.TASKS.GET_TASKS);

  return response.data;
}

export const deleteTask = async (id) => {
  await apiClient.delete(API_ROUTES.TASKS.DELETE_TASK(id));
};

export const updateTask = async (id, formData) => {
  const response = await apiClient.patch(API_ROUTES.TASKS.UPDATE_TASK(id), formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
}