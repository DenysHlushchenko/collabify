import { User } from 'src/modules/user/entities/user.entity';
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
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  message: string;

  @Column()
  rating: number;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => User, (user) => user.feedbacks)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => User, (user) => user.sentFeedbacks)
  @JoinColumn({ name: 'sender_id' })
  sender: User;
}
