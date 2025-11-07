import { AuthActions, AuthStore } from "../store/authStore";
import { authApi } from "../services/authApi";
import { saveToken, removeToken } from "../utils/storage";

export const useAuth = () => {
  const login = async (username: string, password: string) => {
    try {
      AuthActions.setLoading(true);
      const user = await authApi.login(username, password);
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

      const updatedUser = await authApi.updateProfile(
        currentUser.id,
        data,
        currentUser.accessToken
      );
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
    updateProfile,
  };
};
