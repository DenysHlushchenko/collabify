import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Message } from './message.entity';
import { User } from 'src/modules/user/entities/user.entity';

@Entity('message_reactions')
export class MessageReaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  reaction: string;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => Message, (message) => message.reactions)
  @JoinColumn({ name: 'message_id' })
  message: Message;

  @ManyToOne(() => User, (user) => user.messageReactions)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
