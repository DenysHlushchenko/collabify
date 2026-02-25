import { User } from 'src/modules/user/entities/user.entity';
import { Post } from './post.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { VoteType } from 'src/shared/enums/enums';

@Entity('post_votes')
export class PostVote {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Post)
  @JoinColumn({ name: 'post_id' })
  post: Post;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({
    type: 'enum',
    enum: VoteType,
    default: null,
  })
  type: VoteType.LIKE | VoteType.DISLIKE | null;

  @CreateDateColumn()
  created_at: Date;
}
