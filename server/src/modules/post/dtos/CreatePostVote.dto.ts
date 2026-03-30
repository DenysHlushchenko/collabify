import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';
import { VoteType } from 'src/shared/enums/enums';

export class CreatePostVoteDto {
  @ApiProperty({
    description: 'The type of vote',
    enum: ['like', 'dislike', null],
    example: 'like',
  })
  @IsIn([VoteType.LIKE, VoteType.DISLIKE, null])
  type: 'like' | 'dislike' | null;
}
