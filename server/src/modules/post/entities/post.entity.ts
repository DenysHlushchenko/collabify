import { PostTag } from 'src/modules/tag/entities/post_tag.entity';
import { User } from '../../user/entities/user.entity';
import { Comment } from 'src/modules/comment/entities/comment.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Chat } from 'src/modules/chat/entities/chat.entity';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  group_size: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ default: 0, type: 'int' })
  upvotesCount: number;

  @Column({ default: 0, type: 'int' })
  downvotesCount: number;

  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => PostTag, (postTag) => postTag.post, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  postTags: PostTag[];

  @OneToMany(() => Comment, (comment) => comment.post, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  comments: Comment[];

  @ManyToMany(() => Chat, (chat) => chat.posts)
  chats: Chat[];
}
