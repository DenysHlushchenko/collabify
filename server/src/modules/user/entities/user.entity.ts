import { Comment } from '../../comment/entities/comment.entity';
import { Post } from '../../post/entities/post.entity';
import { GenderType, RoleType } from '../../../shared/enums/enums';
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
import { ChatMember } from '../../chat/entities/chat_members.entity';
import { Message } from '../../messages/entities/message.entity';
import { MessageReaction } from '../../messages/entities/message_reaction.entity';
import { Feedback } from '../../feedback/entities/feedback.entity';
import { Notification } from '../../notification/entities/notification.entity';
import { Country } from '../../country/entities/country.entity';

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

  @Column({ enum: RoleType })
  role: RoleType;

  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    default: 0,
    transformer: {
      to(value: number): string | number {
        return value;
      },
      from(value: string): number {
        return value ? Number(value) : 0;
      },
    },
  })
  reputation: number;

  @Column({ nullable: true })
  bio?: string;

  @Column({ unique: true, select: false })
  email: string;

  @Column({ select: false })
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

  @OneToMany(() => Feedback, (feedback) => feedback.sender)
  sentFeedbacks: Feedback[];

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];
}
