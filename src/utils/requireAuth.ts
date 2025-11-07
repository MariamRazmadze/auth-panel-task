import { redirect } from "@tanstack/react-router";
import { AuthStore } from "../store/authStore";

export function requireAuth() {
  if (!AuthStore.isAuthenticated) {
    throw redirect({ to: "/login", replace: true });
  }
}
