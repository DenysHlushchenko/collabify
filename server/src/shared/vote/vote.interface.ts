import { VoteResponse } from '../types';
import { CreateVoteDto } from './dtos/CreateVote.dto';

export interface Voteable {
  getVote: (commentId: number, userId?: number) => Promise<VoteResponse>;
  sendVote: (
    commentId: number,
    userId: number,
    createCommentVoteDto: CreateVoteDto,
  ) => Promise<void>;
}
