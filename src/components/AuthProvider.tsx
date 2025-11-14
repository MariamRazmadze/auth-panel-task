import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { AuthActions } from "../store/authStore";
import { loadToken, removeToken } from "../utils/storage";
import { LoadingSpinner } from "./ui/LoadingSpinner";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const { getCurrentUser } = useAuth();

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

        const success = await getCurrentUser(token);

        if (success) {
          console.log("User session restored");
        } else {
          console.error("Failed to restore session");
          removeToken();
          AuthActions.clearUser();
        }
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
  }, [getCurrentUser]);

  if (!isInitialized) {
    return <LoadingSpinner message="Initializing..." />;
  }

  return <>{children}</>;
};
