export type User = {
  id: number;
  username: string;
  name: string;
  email: string;
  accessToken: string;
};

export type PublicUser = {
  id: number;
  username: string;
  email: string;
};

export type StatusProps = {
  isLoading: boolean;
  isSuccess: boolean;
  isError: string;
};
