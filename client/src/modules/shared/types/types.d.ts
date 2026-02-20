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

type TagType = {
  id: number;
  name: string;
  created_at: Date;
};

export type PostTagType = {
  postId: number;
  tagId: number;
  created_at: Date;
  tag: TagType;
};

export type CommentType = {
  id: number;
  message: string;
  created_at: Date;
  updated_at: Date;
  post: PostType;
  sender: UserType;
};

export type PostType = {
  id: number;
  title: string;
  description: string;
  groupSize: number;
  created_at: Date;
  updated_at: Date;
  user: UserType;
  postTags: PostTagType[];
  comments: CommentType;
};

export type PostFormType = {
  title: string;
  description: string;
  groupSize: number | string;
  tags: string[];
  userId: number;
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
