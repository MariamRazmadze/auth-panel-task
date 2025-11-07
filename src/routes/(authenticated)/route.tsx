import { createFileRoute } from "@tanstack/react-router";
import { requireAuth } from "../../utils/requireAuth";
import { Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/(authenticated)")({
  beforeLoad: requireAuth,
  component: () => <Outlet />,
});
