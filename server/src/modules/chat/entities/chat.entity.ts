import { Post } from 'src/modules/post/entities/post.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ChatMember } from './chat_members.entity';
import { Message } from 'src/modules/messages/entities/message.entity';

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

  @ManyToOne(() => Post, (post) => post.chats)
  @JoinColumn({ name: 'post_id' })
  post: Post;

  @OneToMany(() => ChatMember, (chatMember) => chatMember.chat)
  members: ChatMember[];

  @OneToMany(() => Message, (message) => message.chat)
  messages: Message[];
}
