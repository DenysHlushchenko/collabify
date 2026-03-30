import { ApiProperty } from '@nestjs/swagger';
import { Post } from '../../post/entities/post.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ChatMember } from './chat_members.entity';
import { Message } from '../../messages/entities/message.entity';

@Entity('chats')
export class Chat {
  @ApiProperty({
    description: 'The unique identifier of the chat',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'The title of the chat',
    example: 'My Awesome Chat',
    required: false,
  })
  @Column({ nullable: true })
  title?: string;

  @ApiProperty({
    description: 'The maximum number of members allowed in the chat',
    example: 10,
  })
  @Column()
  max_members: number;

  @ApiProperty({
    description: 'The date and time when the chat was created',
    example: '2023-12-15T10:30:00Z',
  })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({
    description: 'The posts associated with this chat',
    type: () => [Post],
  })
  @ManyToMany(() => Post, (post) => post.chats, {
    onDelete: 'CASCADE',
  })
  @JoinTable({
    name: 'chat_posts',
    joinColumn: { name: 'chat_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'post_id', referencedColumnName: 'id' },
  })
  posts: Post[];

  @ApiProperty({
    description: 'The members of this chat',
    type: () => [ChatMember],
  })
  @OneToMany(() => ChatMember, (chatMember) => chatMember.chat)
  members: ChatMember[];

  @ApiProperty({
    description: 'The messages in this chat',
    type: () => [Message],
  })
  @OneToMany(() => Message, (message) => message.chat, {
    onDelete: 'CASCADE',
  })
  messages: Message[];
}
