import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../user/entities/user.entity';
import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Chat } from './chat.entity';

@Entity('chat_members')
@Unique(['chat', 'user'])
export class ChatMember {
  @ApiProperty({
    description: 'The unique identifier of the chat member',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'The date and time when the user joined the chat',
    example: '2023-12-15T10:30:00Z',
  })
  @CreateDateColumn({ name: 'joined_at' })
  joined_at: Date;

  @ApiProperty({
    description: 'The chat this member belongs to',
    type: () => Chat,
  })
  @ManyToOne(() => Chat, (chat) => chat.members)
  @JoinColumn({ name: 'chat_id' })
  chat: Chat;

  @ApiProperty({
    description: 'The user who is a member of the chat',
    type: () => User,
  })
  @ManyToOne(() => User, (user) => user.chatMembers)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
