import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './dtos/RegisterUser.dto';
import { LoginUserDto } from './dtos/LoginUser.dto';
import { DuplicatedEmailException } from 'src/shared/exceptions/DuplictedEmail.exception';
import { UserDoesNotExistException } from 'src/shared/exceptions/UserDoesNotExist.exception';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { AccessTokenResponseDto } from './dtos/AccessTokenResponse.dto';

enum Auth {
  SALT_ROUNDS = 10,
}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * @param email is required.
   * @returns an existing user account that matches provided email address, otherwise, returns null.
   */
  private findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      select: {
        id: true,
        username: true,
        gender: true,
        reputation: true,
        email: true,
        created_at: true,
        updated_at: true,
      },
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
    return this.userRepository.findOne({
      where: {
        id,
      },
    });
  }

  /**
   * Registers a new user account.
   * New account's unique ID is generated automatically.
   * @param registerUserDto (username, gender, country, email and password).
   * @throws if email is already used by another account.
   */
  async register(registerUserDto: RegisterUserDto): Promise<void> {
    const { username, gender, country, email, password } = registerUserDto;

    const duplicatedUser = await this.findByEmail(email);
    if (duplicatedUser) {
      throw new DuplicatedEmailException(email);
    }

    await this.userRepository.save(
      this.userRepository.create({
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
   * Logs in an existing user account.
   * The method compares given password with a current existing user's password if it matches.
   * @param loginUserDto (email, password)
   * @returns encrypted access token.
   * @throws if user by given email does not exist or password does not match.
   */
  async login(loginUserDto: LoginUserDto): Promise<AccessTokenResponseDto> {
    const { email, password } = loginUserDto;

    const existingUser = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    if (!existingUser) {
      throw new UserDoesNotExistException();
    }

    const isPasswordMatch =
      existingUser && (await bcrypt.compare(password, existingUser.password));

    if (!isPasswordMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return await this.generateAccessToken(existingUser);
  }

  /**
   * @param password is required.
   * @returns a hashed password, generated using hardcoded salt rounds.
   */
  private hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, Auth.SALT_ROUNDS);
  }

  /**
   * @param user is required.
   * @returns a signed JWT access token as a string, storing user ID.
   */
  private async generateAccessToken(
    user: User,
  ): Promise<AccessTokenResponseDto> {
    const accessToken = await this.jwtService.signAsync({
      userId: user.id,
      username: user.username,
    });

    return { accessToken };
  }
}
