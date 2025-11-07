import { useNavigate } from "@tanstack/react-router";
import { useSnapshot } from "valtio";
import { useAuth } from "../hooks/useAuth";
import { AuthStore } from "../store/authStore";

export const Navbar = () => {
  const { isAuthenticated } = useSnapshot(AuthStore);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate({ to: "/login" });
  };

  return (
    <nav className="bg-gray-900 text-white px-8 py-4 flex justify-between items-center shadow-md">
      <button
        onClick={() => navigate({ to: "/" })}
        className="font-bold text-xl hover:text-blue-400 transition"
      >
        MyApp
      </button>

      {isAuthenticated && (
        <div className="flex items-center gap-6">
          <button
            onClick={() => navigate({ to: "/profile" })}
            className="hover:text-blue-400 transition"
          >
            Profile
          </button>
          <button
            onClick={() => navigate({ to: "/users" })}
            className="hover:text-blue-400 transition"
          >
            Users
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700 transition font-medium"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};
