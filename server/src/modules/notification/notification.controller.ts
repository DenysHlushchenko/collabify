import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { Notification } from './entities/notification.entity';

@Controller('/notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get('/users/:userId')
  async getUserNotificationsAndCount(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<[Notification[], number]> {
    return await this.notificationService.getUserNotificationsAndCount(userId);
  }
}
