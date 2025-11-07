import { proxy } from "valtio";
import type { PublicUser, StatusProps } from "./types/user";

type UsersProps = {
  usersData: PublicUser[] | null;
  usersStatus: StatusProps;
  message: string | null;
};

const initialState: UsersProps = {
  usersData: null,
  usersStatus: {
    isLoading: false,
    isSuccess: false,
    isError: "",
  },
  message: null,
};

export const UsersStore = proxy<UsersProps>(initialState);

export const UsersActions = {
  setUsersData: (data: PublicUser[]) => {
    UsersStore.usersData = data;
    UsersStore.usersStatus.isSuccess = true;
    UsersStore.usersStatus.isError = "";
  },

  addUserToStore: (user: PublicUser) => {
    if (UsersStore.usersData) {
      UsersStore.usersData.push(user);
    } else {
      UsersStore.usersData = [user];
    }
  },

  updateUserInStore: (id: number, updatedUser: PublicUser) => {
    if (UsersStore.usersData) {
      UsersStore.usersData = UsersStore.usersData.map((user) =>
        user.id === id ? updatedUser : user
      );
    }
  },

  deleteUserFromStore: (id: number) => {
    if (UsersStore.usersData) {
      UsersStore.usersData = UsersStore.usersData.filter((u) => u.id !== id);
    }
  },

  setLoading: (isLoading: boolean): void => {
    UsersStore.usersStatus.isLoading = isLoading;
  },

  setSuccess: (isSuccess: boolean): void => {
    UsersStore.usersStatus.isSuccess = isSuccess;
  },

  setError: (message: string): void => {
    UsersStore.usersStatus.isError = message;
    UsersStore.usersStatus.isSuccess = false;
  },
  setMessage: (message: string | null): void => {
    UsersStore.message = message;
  },

  clearMessage: (): void => {
    UsersStore.message = null;
  },
};
