import { User } from 'src/user/entities/user.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('countries')
export class Country {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({{ unique: true }})
  name: string;

  @OneToMany(() => User, (user) => user.country)
  users: User[];
}
