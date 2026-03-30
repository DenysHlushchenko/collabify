import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { NotificationService } from './notification.service';
import { Notification } from './entities/notification.entity';
import { AuthGuard } from '../user/auth/auth.guard';

@ApiTags('notifications')
@UseGuards(AuthGuard)
@Controller('/notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get('/users/:userId')
  @ApiOperation({ summary: 'Get user notifications and count' })
  @ApiParam({ name: 'userId', description: 'The ID of the user', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'List of notifications and count',
    schema: {
      type: 'array',
      items: {
        anyOf: [{ type: 'array' }, { type: 'number' }],
      },
    },
  })
  async getUserNotificationsAndCount(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<[Notification[], number]> {
    return await this.notificationService.getUserNotificationsAndCount(userId);
  }

  @Get('/posts/:postId/users/:userId')
  @ApiOperation({ summary: 'Check if user has join request for post' })
  @ApiParam({ name: 'postId', description: 'The ID of the post', type: 'number' })
  @ApiParam({ name: 'userId', description: 'The ID of the user', type: 'number' })
  @ApiResponse({ status: 200, description: 'Join request status' })
  async getPostJoinRequestForCurrentPostByUserId(
    @Param('postId', ParseIntPipe) postId: number,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return await this.notificationService.isPostJoinRequestForCurrentPostByUserId(
      userId,
      postId,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a notification' })
  @ApiParam({ name: 'id', description: 'The ID of the notification', type: 'number' })
  @ApiResponse({ status: 204, description: 'Notification deleted successfully' })
  async deleteNotification(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    return await this.notificationService.delete(id);
  }
}
