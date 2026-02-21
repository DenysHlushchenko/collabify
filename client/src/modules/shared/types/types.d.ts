export type UserType = {
  id: string;
  username: string;
  country: string;
  gender: string;
  role: string;
  bio?: string;
  activityReputation: number;
  feedbackReputation: number;
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

export type TagType = {
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
  comments: CommentType[];
};

export type MessagesType = {
  id: number;
  message: string;
  created_at: Date;
  updated_at: Date;
  chat: ChatType;
  sender: UserType;
  // later we will add MessageReactionType[]
};

export type ChatMemberType = {
  id: number;
  joined_at: Date;
  chat: ChatType;
  user: UserType;
};

export type ChatType = {
  id: number;
  title: string;
  max_members: number;
  isOwner: boolean;
  created_at: Date;
  post: PostType;
  members: ChatMemberType[];
  messages: MessagesType[];
};

/* used only for form input validation */
export type PostFormValues = {
  title: string;
  description: string;
  groupSize: number;
  tags: string[];
  chatTitle?: string | undefined;
  chatId?: number | undefined;
};

/* used to send request to the server */
export type CreatePostPayload = {
  title: string;
  description: string;
  groupSize: number;
  tags: string[];
  chatTitle?: string;
  userId: number;
  chatId?: number;
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

export type FilterType = "ASC" | "DESC" | undefined;

export type BadgeCounts = {
  GOLD: number;
  SILVER: number;
  BRONZE: number;
}