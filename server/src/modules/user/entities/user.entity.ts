import { Comment } from 'src/modules/comment/entities/comment.entity';
import { Post } from '../../post/entities/post.entity';
import { GenderType } from '../../../shared/enums/gender-type';
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
import { ChatMember } from 'src/modules/chat/entities/chat_members.entity';
import { Message } from 'src/modules/messages/entities/message.entity';
import { MessageReaction } from 'src/modules/messages/entities/message_reaction.entity';
import { Feedback } from 'src/modules/feedback/entities/feedback.entity';
import { Notification } from 'src/modules/notification/entities/notification.entity';
import { Country } from 'src/modules/country/entities/country.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @ManyToOne(() => Country, (country) => country.users)
  @JoinColumn({ name: 'country_id' })
  country: Country;

  @Column({ enum: GenderType })
  gender: GenderType;

  @Column()
  reputation: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => Comment, (comment) => comment.sender)
  sentComments: Comment[];

  @OneToMany(() => ChatMember, (chatMember) => chatMember.user)
  chatMembers: ChatMember[];

  @OneToMany(() => Message, (message) => message.sender)
  sentMessages: Message[];

  @OneToMany(() => MessageReaction, (reaction) => reaction.user)
  messageReactions: MessageReaction[];

  @OneToMany(() => Feedback, (feedback) => feedback.user)
  feedbacks: Feedback[];

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];
}
