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
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  title?: string;

  @Column()
  max_members: number;

  @CreateDateColumn()
  created_at: Date;

  @ManyToMany(() => Post, (post) => post.chats, {
    onDelete: 'CASCADE',
  })
  @JoinTable({
    name: 'chat_posts',
    joinColumn: { name: 'chat_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'post_id', referencedColumnName: 'id' },
  })
  posts: Post[];

  @OneToMany(() => ChatMember, (chatMember) => chatMember.chat)
  members: ChatMember[];

  @OneToMany(() => Message, (message) => message.chat, {
    onDelete: 'CASCADE',
  })
  messages: Message[];
}
