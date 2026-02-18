import { Post } from 'src/post/entities/post.entity';
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
  @PrimaryColumn({ name: 'post_id' })
  postId: number;

  @PrimaryColumn({ name: 'tag_id' })
  tagId: number;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => Post, (post) => post.postTags)
  @JoinColumn({ name: 'post_id' })
  post: Post;

  @ManyToOne(() => Tag, (tag) => tag.postTags)
  @JoinColumn({ name: 'tag_id' })
  tag: Tag;
}
