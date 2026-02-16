export type UserType = {
  id: string;
  username: string;
  country: string;
  gender: string;
  reputation: number;
  email: string;
  createdAt: Date;
  updatedAt: Date;
};

export type RegisterType = {
  username: string;
  country: string;
  gender: string;
  email: string;
  password: string;
};

export type LoginType = {
  email: string;
  password: string;
};

export type AuthResponse = {
  token: string;
}