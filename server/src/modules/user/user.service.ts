import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './dtos/RegisterUser.dto';
import { DuplicatedEmailException } from 'src/shared/exceptions/DuplictedEmail.exception';
import bcrypt from 'bcrypt';
import { CountryService } from 'src/modules/country/country.service';
import { EditUserDto } from './dtos/EditUserDto';

enum Auth {
  SALT_ROUNDS = 10,
}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly countryService: CountryService,
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
      select: {
        id: true,
        username: true,
        email: true,
        password: true,
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
      relations: {
        country: true,
        posts: true,
        chatMembers: true,
      },
    });
  }

  /**
   * Creates a new user account with provided information. Throws DuplicatedEmailException if the email address is already in use.
   * @param body is required. It should contain username
   * @returns a newly created user account.
   */
  async create(body: RegisterUserDto): Promise<User> {
    const { username, gender, role, country, email, password } = body;

    const duplicatedUser = await this.findByEmail(email);
    if (duplicatedUser) {
      throw new DuplicatedEmailException(email);
    }

    const countryEntity = await this.countryService.findOrCreateByName(country);

    return this.usersRepository.save(
      this.usersRepository.create({
        username,
        gender,
        role,
        country: countryEntity,
        email,
        activityReputation: 0,
        feedbackReputation: 0,
        password: await this.hashPassword(password),
        created_at: new Date(),
        updated_at: new Date(),
      }),
    );
  }

  /**
   * Updates an existing user account with provided information. Throws an error if the user account is not found.
   * @param editUserDto is required. It should contain username
   * @param id is required. It should be the ID of the user account to be updated.
   * @returns an updated user account.
   */
  async updateUser(editUserDto: EditUserDto, id: number): Promise<User> {
    const { username, gender, country } = editUserDto;
    const user = await this.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const countryEntity = await this.countryService.findOrCreateByName(country);

    user.username = username;
    user.gender = gender;
    user.country = countryEntity;
    user.updated_at = new Date();

    return this.usersRepository.save(user);
  }

  /**
   * @param password is required.
   * @returns a hashed password, generated using hardcoded salt rounds.
   */
  private hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, Auth.SALT_ROUNDS);
  }
}
