import apiClient from './client';
import { API_ROUTES } from './routes';

export const createTask = async (
  formData
) => {
  // const formData = new FormData();

  // formData.append('title', title);
  // formData.append('description', description);
  // formData.append('source_lat', String(sourceLocation.latitude));
  // formData.append('source_lng', String(sourceLocation.longitude));
  // formData.append('destination_lat', String(destinationLocation.latitude));
  // formData.append('destination_lng', String(destinationLocation.longitude));
  // formData.append('destination_name', destinationLocation.name);

  // images.forEach((uri, index) => {
  //   formData.append('images', {
  //     uri,
  //     type: 'image/jpeg',
  //     name: `image_${index}.jpg`,
  //   });
  // });

  const response = await apiClient.post(API_ROUTES.TASKS.CREATE_TASK, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return response.data;
};