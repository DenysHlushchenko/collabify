import { User } from 'src/user/entities/user.entity';
import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Chat } from './chat.entity';

@Entity('chat_members')
export class ChatMember {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ name: 'joined_at' })
  joined_at: Date;

  @ManyToOne(() => Chat, (chat) => chat.members)
  @JoinColumn({ name: 'chat_id' })
  chat: Chat;

  @ManyToOne(() => User, (user) => user.chatMembers)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
