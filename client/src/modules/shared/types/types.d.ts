export type GenderType = "male" | "female" | "other";
export type RoleType = "learner" | "organizer";

export type UserType = {
  id: number;
  username: string;
  country: {
    id: number;
    name: string;
  };
  gender: GenderType;
  role: RoleType;
  reputation: number;
  bio?: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
};

export type EditUserType = {
  username: string;
  gender: GenderType;
  role: RoleType;
  country: string;
  bio?: string;
};

export type UserTypeWithStats = {
  user: UserType;
  stats: {
    postsCount: number;
    commentsCount: number;
    feedbackCount: number;
    upvotesCount: number;
    downvotesCount: number;
  };
  badgeCounts: BadgeCounts;
};

export type RegisterType = {
  username: string;
  country: string;
  gender: string;
  role: string;
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

export type PostType = {
  id: number;
  title: string;
  description: string;
  group_size: number;
  created_at: Date;
  updated_at: Date;
  user: UserType;
  postTags: PostTagType[];
  comments: CommentType[];
};

export type FeedbackType = {
  id: number;
  message: string;
  rating: number;
  created_at: Date;
  sender: UserType;
};

export type CommentType = {
  id: number;
  message: string;
  created_at: Date;
  updated_at: Date;
  sender: UserType;
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
  chatTitle?: string;
  chatId?: number;
};

export type EditPostFormValues = {
  title: string;
  description: string;
  groupSize: number;
  tags: string[];
};

export type FeedbackFormValues = {
  message: string;
  rating: number;
};

export type CommentFormValues = {
  content: string;
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

export type UpdatePostPayload = {
  postId: number;
  title: string;
  description: string;
  groupSize: number;
  tags: string[];
};

export type CreateFeedbackPayload = {
  senderId: number;
  receiverId: number;
  message: string;
  rating: number;
};

export type CreateCommentPayload = {
  content: string;
  senderId: number;
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

export type VoteResponse = {
  userVote: "like" | "dislike" | null;
  votesCounts: {
    upvotesCount: number;
    downvotesCount: number;
  };
};

export type PopularTagsResponse = {
  id: number;
  name: string;
  created_at: Date;
  postCount: number;
}

export type FilterType = "ASC" | "DESC" | undefined;

export type BadgeCounts = {
  GOLD: number;
  SILVER: number;
  BRONZE: number;
};
