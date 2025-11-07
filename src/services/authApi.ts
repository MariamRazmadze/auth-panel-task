import type { User } from "../store/types/user";
import { API_ENDPOINTS } from "../config/api.config";

export const authApi = {
  async login(username: string, password: string): Promise<User> {
    const res = await fetch(API_ENDPOINTS.auth.login, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        password,
        expiresInMins: 30,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Invalid username or password");
    }

    const data = await res.json();
    return {
      id: data.id,
      username: data.username,
      name: `${data.firstName ?? ""} ${data.lastName ?? ""}`.trim(),
      email: data.email,
      accessToken: data.accessToken,
    };
  },

  async getCurrentUser(accessToken: string): Promise<User> {
    const res = await fetch(API_ENDPOINTS.users.me, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch user data");
    }

    const data = await res.json();
    return {
      id: data.id,
      username: data.username,
      name: `${data.firstName ?? ""} ${data.lastName ?? ""}`.trim(),
      email: data.email,
      accessToken,
    };
  },

  async updateProfile(
    id: number,
    data: Partial<User>,
    accessToken: string
  ): Promise<User> {
    const res = await fetch(API_ENDPOINTS.users.byId(id), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Failed to update profile");

    const updated = await res.json();
    return {
      id: updated.id,
      username: updated.username,
      name: `${updated.firstName ?? ""} ${updated.lastName ?? ""}`.trim(),
      email: updated.email,
      accessToken,
    };
  },
};
