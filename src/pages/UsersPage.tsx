import { useState, useEffect } from "react";
import { useSnapshot } from "valtio";
import { useUsers } from "../hooks/useUsers";
import { AuthStore } from "../store/authStore";
import { UsersStore } from "../store/usersStore";
import type { PublicUser } from "../store/types/user";
import { UserForm } from "../components/users/UserForm";
import { UserList } from "../components/users/UserList";

export function UsersPage() {
  const { user: currentUser } = useSnapshot(AuthStore);
  const { usersData, usersStatus, message } = useSnapshot(UsersStore);
  const { fetchUsers, addUser, updateUser, deleteUser } = useUsers();

  const [editUser, setEditUser] = useState<PublicUser | null>(null);

  useEffect(() => {
    if (!usersData && !usersStatus.isLoading && !usersStatus.isError) {
      fetchUsers();
    }
  }, [usersData, usersStatus.isLoading, usersStatus.isError, fetchUsers]);

  const handleSave = async (data: { username: string; email: string }) => {
    try {
      if (editUser) {
        await updateUser(editUser.id, data);
        setEditUser(null);
      } else {
        await addUser(data);
      }
    } catch {
      // Error handled in hook
    }
  };

  const handleDelete = async (id: number) => {
    await deleteUser(id);
  };

  const visibleUsers = (usersData ?? []).filter(
    (u: PublicUser) => u.email !== currentUser?.email
  );

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Users</h1>
      <UserForm
        key={editUser?.id ?? "new"}
        initialData={editUser}
        onSave={handleSave}
        onCancel={() => setEditUser(null)}
        message={message}
      />
      {usersStatus.isLoading ? (
        <p className="text-gray-600">Loading users...</p>
      ) : usersStatus.isError ? (
        <p className="text-red-500">{usersStatus.isError}</p>
      ) : (
        <UserList
          users={visibleUsers}
          onEdit={setEditUser}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
