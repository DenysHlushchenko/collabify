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

export type PostType = {
  id: number;
  title: string;
  description: string;
  groupSize: number;
  created_at: Date;
  updated_at: Date;
  user: UserType;
};

export type AuthResponse = {
  accessToken: string;
};

export type JwtPayload = {
  id: number;
  username: string;
  iat: number;
  exp: number;
};
