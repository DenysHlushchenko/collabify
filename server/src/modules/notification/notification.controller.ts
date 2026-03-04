import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { Notification } from './entities/notification.entity';
import { AuthGuard } from '../user/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('/notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get('/users/:userId')
  async getUserNotificationsAndCount(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<[Notification[], number]> {
    return await this.notificationService.getUserNotificationsAndCount(userId);
  }

  @Delete(':id')
  async deleteNotification(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    return await this.notificationService.delete(id);
  }
}
