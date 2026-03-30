import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Message } from './message.entity';
import { User } from '../../user/entities/user.entity';

@Entity('message_reactions')
@Unique(['message', 'user'])
export class MessageReaction {
  @ApiProperty({ description: 'The unique identifier of the reaction', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'The reaction emoji or text', example: '👍' })
  @Column()
  reaction: string;

  @ApiProperty({ description: 'When the reaction was created' })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({ description: 'The message being reacted to', type: () => Message })
  @ManyToOne(() => Message, (message) => message.reactions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'message_id' })
  message: Message;

  @ApiProperty({ description: 'The user who reacted', type: () => User })
  @ManyToOne(() => User, (user) => user.messageReactions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
