export const API_ROUTES = {
  AUTH: {
    LOGIN_HUB_MANAGER: '/hub_auth/login',
  },

  TASKS: {
    CREATE_TASK: '/tasks',
    GET_TASKS: '/tasks',
    GET_TASK_BY_ID: (id) => `/tasks/${id}`,
    UPDATE_TASK: (id) => `/tasks/${id}`,
    DELETE_TASK: (id) => `/tasks/${id}`,
  },
};