import { proxy } from "valtio";
import type { User, StatusProps } from "./types/user";

type AuthProps = {
  user: User | null;
  isAuthenticated: boolean;
  authStatus: StatusProps & { message?: string };
};

const initialState: AuthProps = {
  user: null,
  isAuthenticated: false,
  authStatus: {
    isLoading: false,
    isSuccess: false,
    isError: "",
    message: "",
  },
};

export const AuthStore = proxy<AuthProps>(initialState);

export const AuthActions = {
  setUser: (user: User) => {
    AuthStore.user = user;
    AuthStore.isAuthenticated = true;
    AuthStore.authStatus.isSuccess = true;
    AuthStore.authStatus.isError = "";
  },

  clearUser: () => {
    AuthStore.user = null;
    AuthStore.isAuthenticated = false;
    AuthStore.authStatus.isSuccess = false;
    AuthStore.authStatus.isError = "";
    AuthStore.authStatus.message = "";
  },

  setLoading: (isLoading: boolean): void => {
    AuthStore.authStatus.isLoading = isLoading;
  },

  setSuccess: (isSuccess: boolean): void => {
    AuthStore.authStatus.isSuccess = isSuccess;
  },

  setError: (message: string): void => {
    AuthStore.authStatus.isError = message;
    AuthStore.authStatus.isSuccess = false;
  },

  setMessage: (message: string): void => {
    AuthStore.authStatus.message = message;
  },

  clearMessage: (): void => {
    AuthStore.authStatus.message = "";
  },
};
