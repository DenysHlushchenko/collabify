import { IsEnum } from 'class-validator';
import { VoteType } from 'src/shared/enums/enums';

export class CreatePostVoteDto {
  @IsEnum(VoteType)
  type: 'like' | 'dislike' | null;
}
