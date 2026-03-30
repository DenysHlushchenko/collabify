import { ApiProperty } from '@nestjs/swagger';
import { PostTag } from '../../tag/entities/post_tag.entity';
import { User } from '../../user/entities/user.entity';
import { Comment } from '../../comment/entities/comment.entity';
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
import { Chat } from '../../chat/entities/chat.entity';

@Entity('posts')
export class Post {
  @ApiProperty({ description: 'The unique identifier of the post', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'The title of the post', example: 'Looking for React developers' })
  @Column()
  title: string;

  @ApiProperty({
    description: 'The description of the post',
    example: 'Need experienced React developers for a startup project',
  })
  @Column()
  description: string;

  @ApiProperty({ description: 'The required group size', example: 3 })
  @Column()
  group_size: number;

  @ApiProperty({ description: 'When the post was created' })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({ description: 'When the post was last updated' })
  @UpdateDateColumn()
  updated_at: Date;

  @ApiProperty({ description: 'Number of upvotes', example: 10 })
  @Column({ default: 0, type: 'int' })
  upvotesCount: number;

  @ApiProperty({ description: 'Number of downvotes', example: 2 })
  @Column({ default: 0, type: 'int' })
  downvotesCount: number;

  @ApiProperty({ description: 'The user who created the post', type: () => User })
  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ApiProperty({ description: 'Tags associated with this post', type: () => [PostTag] })
  @OneToMany(() => PostTag, (postTag) => postTag.post, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  postTags: PostTag[];

  @ApiProperty({ description: 'Comments on this post', type: () => [Comment] })
  @OneToMany(() => Comment, (comment) => comment.post, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  comments: Comment[];

  @ApiProperty({ description: 'Chats associated with this post', type: () => [Chat] })
  @ManyToMany(() => Chat, (chat) => chat.posts)
  chats: Chat[];
}
