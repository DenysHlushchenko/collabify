import { User } from 'src/user/entities/user.entity';
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

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => User, (user) => user.feedbacks)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
