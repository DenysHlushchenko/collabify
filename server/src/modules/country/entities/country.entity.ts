import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../user/entities/user.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('countries')
export class Country {
  @ApiProperty({ description: 'The unique identifier of the country', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'The country name', example: 'United States' })
  @Column({ unique: true })
  name: string;

  @ApiProperty({ description: 'Users from this country', type: () => [User] })
  @OneToMany(() => User, (user) => user.country)
  users: User[];
}
