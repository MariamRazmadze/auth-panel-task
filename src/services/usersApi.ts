import type { PublicUser } from "../store/types/user";
import { API_ENDPOINTS } from "../config/api.config";
import { AuthStore } from "../store/authStore";

const authFetch = async (url: string, options: RequestInit = {}) => {
  const token = AuthStore.user?.accessToken;

  if (!token) {
    throw new Error("Not authenticated");
  }

  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });
};

export const usersApi = {
  async fetchUsers(): Promise<PublicUser[]> {
    const res = await authFetch(API_ENDPOINTS.users.base);
    if (!res.ok) throw new Error("Failed to fetch users");

    const data = await res.json();
    return data.users.map((u: PublicUser) => ({
      id: u.id,
      username: u.username,
      email: u.email,
    }));
  },

  async addUser(user: {
    username: string;
    email: string;
  }): Promise<PublicUser> {
    const res = await authFetch(API_ENDPOINTS.users.add, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });

    if (!res.ok) throw new Error("Failed to add user");
    return res.json();
  },

  async updateUser(id: number, data: Partial<PublicUser>): Promise<PublicUser> {
    const res = await authFetch(API_ENDPOINTS.users.byId(id), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Failed to update user");
    return res.json();
  },

  async deleteUser(id: number): Promise<void> {
    const res = await authFetch(API_ENDPOINTS.users.byId(id), {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Failed to delete user");
  },
};
