import { useCallback } from "react";
import { UsersActions } from "../store/usersStore";
import { usersApi } from "../services/usersApi";
import type { PublicUser } from "../store/types/user";

export const useUsers = () => {
  const fetchUsers = useCallback(async (): Promise<void> => {
    try {
      UsersActions.setLoading(true);
      const users = await usersApi.fetchUsers();
      UsersActions.setUsersData(users);
    } catch (error) {
      UsersActions.setError(
        error instanceof Error ? error.message : "Failed to fetch users"
      );
    } finally {
      UsersActions.setLoading(false);
    }
  }, []);

  const addUser = async (user: {
    username: string;
    email: string;
  }): Promise<void> => {
    UsersActions.setLoading(true);
    try {
      const newUser = await usersApi.addUser(user);
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
      const updated = await usersApi.updateUser(id, data);
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
      await usersApi.deleteUser(id);
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
