const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const API_ENDPOINTS = {
  auth: {
    login: `${API_BASE_URL}/auth/login`,
  },
  users: {
    base: `${API_BASE_URL}/users`,
    me: `${API_BASE_URL}/users/me`,
    add: `${API_BASE_URL}/users/add`,
    byId: (id: number) => `${API_BASE_URL}/users/${id}`,
  },
} as const;
