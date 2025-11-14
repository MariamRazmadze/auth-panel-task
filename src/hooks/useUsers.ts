import { useCallback } from "react";
import { useApi } from "./useApi";
import { UsersActions } from "../store/usersStore";
import { API_ENDPOINTS } from "../config/api.config";
import type { PublicUser } from "../store/types/user";

type UsersResponse = {
  users: PublicUser[];
};

export const useUsers = () => {
  const { get, post, put, del } = useApi();

  const fetchUsers = useCallback(async (): Promise<void> => {
    try {
      UsersActions.setLoading(true);

      const data = await get<UsersResponse>(API_ENDPOINTS.users.base);

      const users = data.users.map((u: PublicUser) => ({
        id: u.id,
        username: u.username,
        email: u.email,
      }));
      UsersActions.setUsersData(users);
    } catch (error) {
      UsersActions.setError(
        error instanceof Error ? error.message : "Failed to fetch users"
      );
    } finally {
      UsersActions.setLoading(false);
    }
  }, [get]);

  const addUser = async (user: {
    username: string;
    email: string;
  }): Promise<void> => {
    UsersActions.setLoading(true);
    try {
      const newUser = await post<PublicUser>(API_ENDPOINTS.users.add, user);

      UsersActions.addUserToStore(newUser);
      UsersActions.setMessage("User added");
    } catch (error) {
      UsersActions.setError(
        error instanceof Error ? error.message : "Failed to add user"
      );
      UsersActions.setMessage("Failed to add user");
      throw error;
    } finally {
      UsersActions.setLoading(false);
    }
  };

  const updateUser = async (
    id: number,
    data: Partial<PublicUser>
  ): Promise<void> => {
    UsersActions.setLoading(true);
    try {
      const updated = await put<PublicUser>(API_ENDPOINTS.users.byId(id), data);

      UsersActions.updateUserInStore(id, updated);
      UsersActions.setMessage("User updated");
    } catch (error) {
      UsersActions.setError(
        error instanceof Error ? error.message : "Failed to update user"
      );
      UsersActions.setMessage("Failed to update user");
      throw error;
    } finally {
      UsersActions.setLoading(false);
    }
  };

  const deleteUser = async (id: number): Promise<void> => {
    UsersActions.setLoading(true);
    try {
      await del(API_ENDPOINTS.users.byId(id));

      UsersActions.deleteUserFromStore(id);
      UsersActions.setMessage("User deleted");
    } catch (error) {
      UsersActions.setError(
        error instanceof Error ? error.message : "Failed to delete user"
      );
      UsersActions.setMessage("Failed to delete user");
    } finally {
      UsersActions.setLoading(false);
    }
  };

  return {
    fetchUsers,
    addUser,
    updateUser,
    deleteUser,
  };
};
