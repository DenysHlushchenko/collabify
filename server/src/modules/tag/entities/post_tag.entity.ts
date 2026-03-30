import { ApiProperty } from '@nestjs/swagger';
import { Post } from '../../post/entities/post.entity';
import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { Tag } from './tag.entity';

@Entity('post_tags')
export class PostTag {
  @ApiProperty({ description: 'The ID of the post', example: 1 })
  @PrimaryColumn({ name: 'post_id' })
  postId: number;

  @ApiProperty({ description: 'The ID of the tag', example: 1 })
  @PrimaryColumn({ name: 'tag_id' })
  tagId: number;

  @ApiProperty({ description: 'When the association was created' })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({ description: 'The post', type: () => Post })
  @ManyToOne(() => Post, (post) => post.postTags, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'post_id' })
  post: Post;

  @ApiProperty({ description: 'The tag', type: () => Tag })
  @ManyToOne(() => Tag, (tag) => tag.postTags, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tag_id' })
  tag: Tag;
}
