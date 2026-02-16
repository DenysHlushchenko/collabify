import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from '../user.service';
import { RegisterUserDto } from '../dtos/RegisterUser.dto';
import { LoginUserDto } from '../dtos/LoginUser.dto';
import { AccessTokenResponseDto } from '../dtos/AccessTokenResponse.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @Post('/register')
  async registerAccount(
    @Body() registerUserDto: RegisterUserDto,
  ): Promise<void> {
    return await this.userService.register(registerUserDto);
  }

  @Post('/login')
  async loginAccount(
    @Body() loginUserDto: LoginUserDto,
  ): Promise<AccessTokenResponseDto> {
    return await this.userService.login(loginUserDto);
  }
}
