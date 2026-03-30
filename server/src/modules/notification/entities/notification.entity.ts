import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('notifications')
export class Notification {
  @ApiProperty({ description: 'The unique identifier of the notification', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'The type of notification', example: 'join_request' })
  @Column()
  type: string;

  @ApiProperty({ description: 'The notification content', example: 'User wants to join your post' })
  @Column()
  content: string;

  @ApiProperty({ description: 'The ID of the associated post', example: 1 })
  @Column()
  postId: number;

  @ApiProperty({ description: 'When the notification was created' })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({
    description: 'The user who triggered this notification',
    type: () => User,
    required: false,
  })
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'from_user_id' })
  fromUser: User | null;

  @ApiProperty({ description: 'The user receiving this notification', type: () => User })
  @ManyToOne(() => User, (user) => user.notifications)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
