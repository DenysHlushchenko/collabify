import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from './auth/auth.guard';
import { UserService } from './user.service';
import { EditUserDto } from './dtos/EditUserDto';

@UseGuards(AuthGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  async getUserById(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.findByIdWithStats(id);
  }

  @Put(':id')
  async updateUser(
    @Body() editUserDto: EditUserDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return await this.userService.updateUser(editUserDto, id);
  }
}
