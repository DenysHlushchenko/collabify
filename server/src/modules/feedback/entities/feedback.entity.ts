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

@Entity('feedbacks')
export class Feedback {
  @ApiProperty({ description: 'The unique identifier of the feedback', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'The feedback message', example: 'Great collaboration!' })
  @Column()
  message: string;

  @ApiProperty({ description: 'The rating given', example: 5 })
  @Column()
  rating: number;

  @ApiProperty({ description: 'When the feedback was created' })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({ description: 'The user who received the feedback', type: () => User })
  @ManyToOne(() => User, (user) => user.feedbacks)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ApiProperty({ description: 'The user who sent the feedback', type: () => User })
  @ManyToOne(() => User, (user) => user.sentFeedbacks)
  @JoinColumn({ name: 'sender_id' })
  sender: User;
}
