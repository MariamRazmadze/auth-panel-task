import { useApi } from "./useApi";
import { AuthActions, AuthStore } from "../store/authStore";
import { API_ENDPOINTS } from "../config/api.config";
import { saveToken, removeToken } from "../utils/storage";
import type { User, LoginResponse, UserResponse } from "../store/types/user";

export const useAuth = () => {
  const { post, get, put } = useApi();

  const login = async (username: string, password: string) => {
    try {
      AuthActions.setLoading(true);

      const data = await post<LoginResponse>(API_ENDPOINTS.auth.login, {
        username,
        password,
        expiresInMins: 30,
      });

      const user: User = {
        id: data.id,
        username: data.username,
        name: `${data.firstName ?? ""} ${data.lastName ?? ""}`.trim(),
        email: data.email,
        accessToken: data.accessToken,
      };

      saveToken(user.accessToken);
      AuthActions.setUser(user);
      return true;
    } catch (error) {
      AuthActions.setError(
        error instanceof Error ? error.message : "Login failed unexpectedly"
      );
      return false;
    } finally {
      AuthActions.setLoading(false);
    }
  };

  const logout = () => {
    removeToken();
    AuthActions.clearUser();
  };

  const getCurrentUser = async (accessToken: string) => {
    try {
      AuthActions.setLoading(true);

      const data = await get<UserResponse>(API_ENDPOINTS.users.me);

      const user: User = {
        id: data.id,
        username: data.username,
        name: `${data.firstName ?? ""} ${data.lastName ?? ""}`.trim(),
        email: data.email,
        accessToken,
      };

      AuthActions.setUser(user);
      return true;
    } catch (error) {
      AuthActions.setError(
        error instanceof Error ? error.message : "Failed to fetch user"
      );
      return false;
    } finally {
      AuthActions.setLoading(false);
    }
  };

  const updateProfile = async (
    data: Partial<{
      username: string;
      email: string;
      name: string;
    }>
  ) => {
    try {
      AuthActions.setLoading(true);

      const currentUser = AuthStore.user;
      if (!currentUser) {
        throw new Error("No user logged in");
      }
      const apiPayload: Record<string, unknown> = {};
      if (data.username !== undefined) {
        apiPayload.username = data.username;
      }
      if (data.email !== undefined) {
        apiPayload.email = data.email;
      }
      if (data.name !== undefined) {
        const nameParts = data.name.trim().split(" ");
        apiPayload.firstName = nameParts[0] || "";
        apiPayload.lastName = nameParts.slice(1).join(" ") || "";
      }

      console.log("Sending to API:", apiPayload);
      const updated = await put<UserResponse>(
        API_ENDPOINTS.users.byId(currentUser.id),
        apiPayload
      );
      const updatedUser: User = {
        id: updated.id,
        username: updated.username,
        name: `${updated.firstName ?? ""} ${updated.lastName ?? ""}`.trim(),
        email: updated.email,
        accessToken: currentUser.accessToken,
      };

      AuthActions.setUser(updatedUser);
      return true;
    } catch (error) {
      AuthActions.setError(
        error instanceof Error ? error.message : "Failed to update profile"
      );
      return false;
    } finally {
      AuthActions.setLoading(false);
    }
  };

  return {
    login,
    logout,
    getCurrentUser,
    updateProfile,
  };
};
