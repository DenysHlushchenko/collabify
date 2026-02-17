import { Body, Controller, Post } from '@nestjs/common';
import { RegisterUserDto } from '../dtos/RegisterUser.dto';
import { LoginUserDto } from '../dtos/LoginUser.dto';
import { AccessTokenResponseDto } from '../dtos/AccessTokenResponse.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  async registerAccount(
    @Body() registerUserDto: RegisterUserDto,
  ): Promise<void> {
    return await this.authService.register(registerUserDto);
  }

  @Post('/login')
  async loginAccount(
    @Body() loginUserDto: LoginUserDto,
  ): Promise<AccessTokenResponseDto> {
    return await this.authService.login(loginUserDto);
  }
}
