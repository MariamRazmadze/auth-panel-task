import { useState, useEffect } from "react";
import { useSnapshot } from "valtio";
import { useAuth } from "../hooks/useAuth";
import { AuthStore, AuthActions } from "../store/authStore";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";

export default function ProfilePage() {
  const { updateProfile } = useAuth();
  const { user, authStatus } = useSnapshot(AuthStore);

  const [form, setForm] = useState({
    username: user?.username || "",
    email: user?.email || "",
    name: user?.name || "",
  });

  const [editing, setEditing] = useState(false);
  useEffect(() => {
    return () => {
      AuthActions.clearMessage();
    };
  }, []);

  useEffect(() => {
    if (editing) {
      AuthActions.clearMessage();
    }
  }, [editing]);

  if (!user) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await updateProfile(form);

    if (success) {
      setEditing(false);
      AuthActions.setMessage("Profile updated successfully!");
    } else {
      AuthActions.setMessage(authStatus.isError || "Failed to update profile");
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setForm({
      username: user.username,
      email: user.email,
      name: user.name,
    });
    AuthActions.clearMessage();
  };

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <form
        onSubmit={handleSave}
        className="bg-white p-4 rounded shadow space-y-3"
      >
        <Input
          label="Name"
          type="text"
          value={form.name}
          disabled={!editing}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        />

        <Input
          label="Username"
          type="text"
          value={form.username}
          disabled={!editing}
          onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
        />

        <Input
          label="Email"
          type="email"
          value={form.email}
          disabled={!editing}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
        />

        {editing ? (
          <div className="flex gap-2">
            <Button
              type="submit"
              variant="success"
              isLoading={authStatus.isLoading}
            >
              Save
            </Button>
            <Button type="button" variant="secondary" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        ) : (
          <Button type="button" onClick={() => setEditing(true)}>
            Edit Profile
          </Button>
        )}

        {authStatus.message && (
          <p
            className={`text-sm ${
              authStatus.message.includes("success")
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {authStatus.message}
          </p>
        )}
      </form>
    </div>
  );
}
