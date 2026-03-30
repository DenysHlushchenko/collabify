import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../user/entities/user.entity';
import { Comment } from './comment.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { VoteType } from '../../../shared/enums/enums';
import { IsOptional } from 'class-validator';

@Unique(['user', 'comment'])
@Entity('comment_votes')
export class CommentVote {
  @ApiProperty({ description: 'The unique identifier of the vote', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'The comment being voted on', type: () => Comment })
  @ManyToOne(() => Comment, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'comment_id' })
  comment: Comment;

  @ApiProperty({ description: 'The user casting the vote', type: () => User })
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ApiProperty({
    description: 'The vote type',
    enum: ['like', 'dislike', null],
    example: 'like',
  })
  @IsOptional()
  @Column({
    type: 'enum',
    enum: VoteType,
    default: null,
  })
  type: VoteType.LIKE | VoteType.DISLIKE | null;

  @ApiProperty({ description: 'When the vote was created' })
  @CreateDateColumn()
  created_at: Date;
}
