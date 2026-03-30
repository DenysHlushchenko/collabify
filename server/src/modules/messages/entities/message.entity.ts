import { ApiProperty } from '@nestjs/swagger';
import { Chat } from '../../chat/entities/chat.entity';
import { User } from '../../user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MessageReaction } from './message_reaction.entity';

@Entity('messages')
export class Message {
  @ApiProperty({ description: 'The unique identifier of the message', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'The message content', example: 'Hello!' })
  @Column()
  message: string;

  @ApiProperty({ description: 'Whether this is a chat join notification', example: false })
  @Column({ default: false })
  isChatJoinMessage: boolean;

  @ApiProperty({ description: 'When the message was created' })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({ description: 'When the message was last updated' })
  @UpdateDateColumn()
  updated_at: Date;

  @ApiProperty({ description: 'The chat this message belongs to', type: () => Chat })
  @ManyToOne(() => Chat, (chat) => chat.messages, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'chat_id' })
  chat: Chat;

  @ApiProperty({ description: 'The user who sent the message', type: () => User })
  @ManyToOne(() => User, (user) => user.sentMessages, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'sender_id' })
  sender: User;

  @ApiProperty({
    description: 'The reactions on this message',
    type: () => [MessageReaction],
  })
  @OneToMany(() => MessageReaction, (reaction) => reaction.message)
  reactions: MessageReaction[];
}
