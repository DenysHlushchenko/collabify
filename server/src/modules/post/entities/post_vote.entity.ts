import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../user/entities/user.entity';
import { Post } from './post.entity';
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

@Unique(['user', 'post'])
@Entity('post_votes')
export class PostVote {
  @ApiProperty({ description: 'The unique identifier of the vote', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'The post being voted on', type: () => Post })
  @ManyToOne(() => Post, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'post_id' })
  post: Post;

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
