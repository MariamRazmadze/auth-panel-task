import type { PublicUser } from "../../store/types/user";

type Props = {
  users: PublicUser[];
  onEdit: (user: PublicUser) => void;
  onDelete: (id: number) => void;
};

export function UserList({ users, onEdit, onDelete }: Props) {
  if (users.length === 0)
    return (
      <div className="bg-white p-4 rounded-xl shadow text-gray-600 text-center">
        No users found.
      </div>
    );

  return (
    <ul className="bg-white rounded-xl shadow divide-y border border-gray-100">
      {users.map((u) => (
        <li
          key={u.id}
          className="p-4 flex justify-between items-center hover:bg-gray-50 transition"
        >
          <div>
            <div className="font-medium">{u.username}</div>
            <div className="text-sm text-gray-500">{u.email}</div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => onEdit(u)}
              className="text-blue-600 hover:underline"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(u.id)}
              className="text-red-600 hover:underline"
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
