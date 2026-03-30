import { ApiProperty } from '@nestjs/swagger';
import { Post } from '../../post/entities/post.entity';
import { User } from '../../user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('comments')
export class Comment {
  @ApiProperty({ description: 'The unique identifier of the comment', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'The comment text', example: 'Great post!' })
  @Column()
  message: string;

  @ApiProperty({ description: 'Number of upvotes', example: 5 })
  @Column({ default: 0, type: 'int' })
  upvotesCount: number;

  @ApiProperty({ description: 'Number of downvotes', example: 2 })
  @Column({ default: 0, type: 'int' })
  downvotesCount: number;

  @ApiProperty({ description: 'When the comment was created' })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({ description: 'When the comment was last updated' })
  @UpdateDateColumn()
  updated_at: Date;

  @ApiProperty({ description: 'The post this comment is on', type: () => Post })
  @ManyToOne(() => Post, (post) => post.comments)
  @JoinColumn({ name: 'post_id' })
  post: Post;

  @ApiProperty({ description: 'The user who sent the comment', type: () => User })
  @ManyToOne(() => User, (user) => user.sentComments)
  @JoinColumn({ name: 'sender_id' })
  sender: User;
}
