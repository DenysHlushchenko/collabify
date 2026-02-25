import { IsIn } from 'class-validator';
import { VoteType } from 'src/shared/enums/enums';

export class CreatePostVoteDto {
  @IsIn([VoteType.LIKE, VoteType.DISLIKE, null])
  type: 'like' | 'dislike' | null;
}
