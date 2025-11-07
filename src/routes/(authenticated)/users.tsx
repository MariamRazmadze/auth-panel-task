import { createFileRoute } from "@tanstack/react-router";
import { UsersPage } from "../../pages/UsersPage";

export const Route = createFileRoute("/(authenticated)/users")({
  component: UsersPage,
});
