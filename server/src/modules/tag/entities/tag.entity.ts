import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PostTag } from './post_tag.entity';

@Entity('tags')
export class Tag {
  @ApiProperty({ description: 'The unique identifier of the tag', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'The tag name', example: 'React' })
  @Column({ unique: true })
  name: string;

  @ApiProperty({ description: 'When the tag was created' })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({ description: 'Posts associated with this tag', type: () => [PostTag] })
  @OneToMany(() => PostTag, (postTag) => postTag.tag)
  postTags: PostTag[];
}
