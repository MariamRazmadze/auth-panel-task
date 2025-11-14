import { useNavigate } from "@tanstack/react-router";
import { loadToken, removeToken } from "../utils/storage";
import { AuthActions } from "../store/authStore";

type RequestOptions = {
  endpoint: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: Record<string, unknown>;
  headers?: HeadersInit;
  notifySuccess?: boolean;
  notifyError?: boolean;
  successMessage?: string;
  errorMessage?: string;
};

const DEFAULT_HEADERS: HeadersInit = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

const isErrorWithMessage = (error: unknown): error is Error => {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as Record<string, unknown>).message === "string"
  );
};

const getErrorMessage = (error: unknown): string => {
  if (isErrorWithMessage(error)) return error.message;
  return String(error);
};

export const useApi = () => {
  const navigate = useNavigate();

  const resetAuthSession = async () => {
    removeToken();
    AuthActions.clearUser();
    await navigate({
      to: "/login",
      replace: true,
    });
  };

  const getHeaders = (customHeaders?: HeadersInit): HeadersInit => {
    const token = loadToken();

    return {
      ...DEFAULT_HEADERS,
      ...(customHeaders || {}),
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  };

  const request = async <T>({
    endpoint,
    method = "GET",
    body,
    headers,
    notifySuccess = false,
    notifyError = false,
    successMessage = "Operation completed successfully",
    errorMessage = "An unexpected error occurred",
  }: RequestOptions): Promise<T> => {
    try {
      const response = await fetch(endpoint, {
        method,
        headers: getHeaders(headers),
        ...(body && { body: JSON.stringify(body) }),
      });

      if (response.status === 401) {
        await resetAuthSession();
        throw new Error("Unauthorized");
      }

      let data;
      try {
        const text = await response.text();
        data = text ? JSON.parse(text) : null;
      } catch {
        data = null;
      }

      if (!response.ok) {
        const errorMsg =
          data?.message ||
          data?.error ||
          `Request failed with status ${response.status}`;

        if (notifyError) {
          console.error("API Error:", errorMsg);
        }

        throw new Error(errorMsg);
      }

      if (notifySuccess) {
        console.log("Success:", data?.message || successMessage);
      }

      return data;
    } catch (error: unknown) {
      if (notifyError) {
        console.error("Request Error:", getErrorMessage(error) || errorMessage);
      }
      throw error;
    }
  };

  return {
    get: <T>(
      endpoint: string,
      options?: Omit<RequestOptions, "endpoint" | "method">
    ) => request<T>({ endpoint, ...options }),

    post: <T>(
      endpoint: string,
      body: Record<string, unknown>,
      options?: Omit<RequestOptions, "endpoint" | "method" | "body">
    ) => request<T>({ endpoint, method: "POST", body, ...options }),

    put: <T>(
      endpoint: string,
      body: Record<string, unknown>,
      options?: Omit<RequestOptions, "endpoint" | "method" | "body">
    ) => request<T>({ endpoint, method: "PUT", body, ...options }),

    patch: <T>(
      endpoint: string,
      body: Record<string, unknown>,
      options?: Omit<RequestOptions, "endpoint" | "method" | "body">
    ) => request<T>({ endpoint, method: "PATCH", body, ...options }),

    del: <T>(
      endpoint: string,
      options?: Omit<RequestOptions, "endpoint" | "method">
    ) => request<T>({ endpoint, method: "DELETE", ...options }),
  };
};
