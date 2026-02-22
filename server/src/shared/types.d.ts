import { User } from 'src/modules/user/entities/user.entity';

export interface ChatWithOwner extends Chat {
  isOwner: boolean;
}

export interface BadgeCounts {
  GOLD: number;
  SILVER: number;
  BRONZE: number;
}

export type BadgeCriteriaType = keyof typeof BADGE_CRITERIA;

export interface UserWithStats {
  user: User;
  stats: {
    postsCount: number;
    commentsCount: number;
    feedbackCount: number;
    upvotesCount: number;
    downvotesCount: number;
  };
  badgeCounts: BadgeCounts;
}

export interface PostVoteStats {
  upvotesCount: string | null;
  downvotesCount: string | null;
}
