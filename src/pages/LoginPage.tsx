import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useSnapshot } from "valtio";
import { useAuth } from "../hooks/useAuth";
import { AuthStore } from "../store/authStore";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";

export default function LoginPage() {
  const { login } = useAuth();
  const { authStatus } = useSnapshot(AuthStore);
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(username.trim(), password.trim());
    if (success) navigate({ to: "/profile" });
  };

  return (
    <div className="flex h-[80vh] items-center justify-center">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-xl shadow-lg w-80 space-y-4 border border-gray-200"
      >
        <h1 className="text-2xl font-semibold text-center">Sign In</h1>

        {authStatus.isError && (
          <p className="text-red-500 text-sm text-center">
            {authStatus.isError}
          </p>
        )}

        <Input
          type="text"
          placeholder="Username"
          value={username}
          required
          onChange={(e) => setUsername(e.target.value)}
        />

        <Input
          type="password"
          placeholder="Password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          type="submit"
          isLoading={authStatus.isLoading}
          className="w-full"
        >
          Login
        </Button>

        <p className="text-xs text-gray-500 text-center">
          Demo credentials: <br />
          <strong>emilys</strong> / <strong>emilyspass</strong>
        </p>
      </form>
    </div>
  );
}
