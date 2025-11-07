import { useState, useEffect } from "react";
import type { PublicUser } from "../../store/types/user";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

type Props = {
  initialData?: PublicUser | null;
  onSave: (data: { username: string; email: string }) => void;
  onCancel: () => void;
  message: string | null;
};

export function UserForm({ initialData, onSave, onCancel, message }: Props) {
  const [form, setForm] = useState({ username: "", email: "" });

  useEffect(() => {
    if (initialData) {
      setForm({ username: initialData.username, email: initialData.email });
    } else {
      setForm({ username: "", email: "" });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.username.trim() || !form.email.trim()) return;
    onSave(form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-5 rounded-xl shadow space-y-3 border border-gray-200"
    >
      <div className="grid grid-cols-2 gap-3">
        <Input
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
        />
        <Input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
        />
      </div>

      <div className="flex gap-2">
        <Button type="submit" variant={initialData ? "success" : "primary"}>
          {initialData ? "Save" : "Add User"}
        </Button>

        {initialData && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>

      {message && <div className="text-green-600 text-sm">{message}</div>}
    </form>
  );
}
