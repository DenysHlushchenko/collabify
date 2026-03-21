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
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Post, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'post_id' })
  post: Post;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @IsOptional()
  @Column({
    type: 'enum',
    enum: VoteType,
    default: null,
  })
  type: VoteType.LIKE | VoteType.DISLIKE | null;

  @CreateDateColumn()
  created_at: Date;
}
