import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({ description: 'The unique identifier of the user', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'The username of the user', example: 'johndoe' })
  @Column()
  username: string;

  @ApiProperty({ description: 'The country of the user', type: () => Country })
  @ManyToOne(() => Country, (country) => country.users)
  @JoinColumn({ name: 'country_id' })
  country: Country;

  @ApiProperty({ description: 'The gender of the user', enum: GenderType })
  @Column({ enum: GenderType })
  gender: GenderType;

  @ApiProperty({ description: 'The role of the user', enum: RoleType })
  @Column({ enum: RoleType })
  role: RoleType;

  @ApiProperty({
    description: 'The reputation score of the user',
    example: 4.5,
    type: 'number',
  })
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

  @ApiProperty({
    description: 'The bio of the user',
    example: 'Passionate about web development',
    required: false,
  })
  @Column({ nullable: true })
  bio?: string;

  @ApiProperty({ description: 'The email of the user (not publicly exposed)', example: 'john@example.com' })
  @Column({ unique: true, select: false })
  email: string;

  @ApiProperty({ description: 'The password hash (not publicly exposed)' })
  @Column({ select: false })
  password: string;

  @ApiProperty({ description: 'When the user account was created' })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({ description: 'When the user account was last updated' })
  @UpdateDateColumn()
  updated_at: Date;

  @ApiProperty({ description: 'Posts created by this user', type: () => [Post] })
  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @ApiProperty({ description: 'Comments sent by this user', type: () => [Comment] })
  @OneToMany(() => Comment, (comment) => comment.sender)
  sentComments: Comment[];

  @ApiProperty({ description: 'Chat memberships', type: () => [ChatMember] })
  @OneToMany(() => ChatMember, (chatMember) => chatMember.user)
  chatMembers: ChatMember[];

  @ApiProperty({ description: 'Messages sent by this user', type: () => [Message] })
  @OneToMany(() => Message, (message) => message.sender)
  sentMessages: Message[];

  @ApiProperty({ description: 'Message reactions from this user', type: () => [MessageReaction] })
  @OneToMany(() => MessageReaction, (reaction) => reaction.user)
  messageReactions: MessageReaction[];

  @ApiProperty({ description: 'Feedback received by this user', type: () => [Feedback] })
  @OneToMany(() => Feedback, (feedback) => feedback.user)
  feedbacks: Feedback[];

  @ApiProperty({ description: 'Feedback sent by this user', type: () => [Feedback] })
  @OneToMany(() => Feedback, (feedback) => feedback.sender)
  sentFeedbacks: Feedback[];

  @ApiProperty({ description: 'Notifications for this user', type: () => [Notification] })
  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];
}
