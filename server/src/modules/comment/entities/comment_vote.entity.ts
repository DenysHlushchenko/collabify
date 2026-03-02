import { User } from 'src/modules/user/entities/user.entity';
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
import { VoteType } from 'src/shared/enums/enums';
import { IsOptional } from 'class-validator';

@Unique(['user', 'comment'])
@Entity('comment_votes')
export class CommentVote {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Comment, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'comment_id' })
  comment: Comment;

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
