import { createFileRoute, redirect } from "@tanstack/react-router";
import { AuthStore } from "../store/authStore";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    if (AuthStore.isAuthenticated) {
      throw redirect({ to: "/profile" });
    } else {
      throw redirect({ to: "/login" });
    }
  },
});
