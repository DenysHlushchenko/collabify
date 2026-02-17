import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user.service';
import { RegisterUserDto } from '../dtos/RegisterUser.dto';
import { LoginUserDto } from '../dtos/LoginUser.dto';
import { AccessTokenResponseDto } from '../dtos/AccessTokenResponse.dto';
import { UserDoesNotExistException } from 'src/shared/exceptions/UserDoesNotExist.exception';
import { User } from '../entities/user.entity';

import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  /**
   * Registers a new user account.
   * New account's unique ID is generated automatically.
   * @param registerUserDto (username, gender, country, email and password).
   * @throws if email is already used by another account.
   */
  async register(registerUserDto: RegisterUserDto): Promise<void> {
    await this.userService.create(registerUserDto);
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

    const existingUser = await this.userService.findByEmail(email);

    if (!existingUser) {
      throw new UserDoesNotExistException();
    }

    const isPasswordMatch = await bcrypt.compare(
      password,
      existingUser.password,
    );

    if (!isPasswordMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return this.generateAccessToken(existingUser);
  }

  /**
   * @param user is required.
   * @returns a signed JWT access token as a string, storing user ID and username.
   */
  private generateAccessToken(user: User): AccessTokenResponseDto {
    const accessToken = jwt.sign(
      {
        id: user.id,
        username: user.username,
      },
      String(process.env.JWT_SECRET_KEY),
    );

    return { accessToken };
  }
}
