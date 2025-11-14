import { Outlet, createRootRoute } from "@tanstack/react-router";
import { Navbar } from "../components/Navbar";
import { AuthProvider } from "../components/AuthProvider";

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <main className="container mx-auto px-4 py-6">
          <Outlet />
        </main>
      </div>
    </AuthProvider>
  );
}
