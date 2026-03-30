import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { AuthGuard } from './auth/auth.guard';
import { UserService } from './user.service';
import { EditUserDto } from './dtos/EditUserDto';

@ApiTags('users')
@UseGuards(AuthGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID with stats' })
  @ApiParam({ name: 'id', description: 'The ID of the user', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'User details with statistics',
    example: {
      id: 1,
      username: 'johndoe',
      gender: 'Male',
      role: 'Student',
      reputation: 4.5,
      bio: 'Passionate about web development',
      country: { id: 1, name: 'United States' },
      created_at: '2023-12-15T10:30:00Z',
      updated_at: '2024-03-30T14:22:00Z',
      stats: {
        postsCount: 5,
        commentsCount: 12,
        feedbackCount: 8,
      },
    },
  })
  async getUserById(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.findByIdWithStats(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update user profile' })
  @ApiParam({ name: 'id', description: 'The ID of the user', type: 'number' })
  @ApiBody({ type: EditUserDto })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    example: {
      id: 1,
      username: 'johndoe',
      gender: 'Male',
      role: 'Student',
      reputation: 4.5,
      bio: 'Passionate about web development and open source',
      country: { id: 1, name: 'United States' },
      created_at: '2023-12-15T10:30:00Z',
      updated_at: '2024-03-30T15:45:00Z',
    },
  })
  async updateUser(
    @Body() editUserDto: EditUserDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return await this.userService.updateUser(editUserDto, id);
  }
}
