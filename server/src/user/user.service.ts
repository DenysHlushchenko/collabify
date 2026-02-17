import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './dtos/RegisterUser.dto';
import { DuplicatedEmailException } from 'src/shared/exceptions/DuplictedEmail.exception';
import bcrypt from 'bcrypt';

enum Auth {
  SALT_ROUNDS = 10,
}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  /**
   * @param email is required.
   * @returns an existing user account that matches provided email address, otherwise, returns null.
   */
  findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: {
        email,
      },
    });
  }

  /**
   * @param id is required.
   * @returns an existing user account that matches provided ID, otherwise, returns null.
   */
  findById(id: number): Promise<User | null> {
    return this.usersRepository.findOne({
      where: {
        id,
      },
    });
  }

  async create(body: RegisterUserDto): Promise<User> {
    const { username, gender, country, email, password } = body;

    const duplicatedUser = await this.findByEmail(email);
    if (duplicatedUser) {
      throw new DuplicatedEmailException(email);
    }

    return this.usersRepository.save(
      this.usersRepository.create({
        username,
        gender,
        country,
        email,
        reputation: 0,
        password: await this.hashPassword(password),
        created_at: new Date(),
        updated_at: new Date(),
      }),
    );
  }

  /**
   * @param password is required.
   * @returns a hashed password, generated using hardcoded salt rounds.
   */
  private hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, Auth.SALT_ROUNDS);
  }
}
