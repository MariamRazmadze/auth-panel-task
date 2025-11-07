import { useEffect, useState } from "react";
import { authApi } from "../services/authApi";
import { AuthActions } from "../store/authStore";
import { loadToken, removeToken } from "../utils/storage";
import { LoadingSpinner } from "./ui/LoadingSpinner";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      const token = loadToken();

      if (!token) {
        setIsInitialized(true);
        return;
      }

      try {
        AuthActions.setLoading(true);
        console.log("Restoring session with token:", token);
        const user = await authApi.getCurrentUser(token);
        console.log("User restored:", user);

        AuthActions.setUser(user);
      } catch (error) {
        console.error("Failed to restore session:", error);
        removeToken();
        AuthActions.clearUser();
      } finally {
        AuthActions.setLoading(false);
        setIsInitialized(true);
      }
    };

    initAuth();
  }, []);

  if (!isInitialized) {
    return <LoadingSpinner message="Initializing..." />;
  }

  return <>{children}</>;
};
