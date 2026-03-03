import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { UserDoesNotExistException } from 'src/shared/exceptions/UserDoesNotExist.exception';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    private readonly userService: UserService,
  ) {}

  async create(notification: Notification): Promise<void> {
    await this.notificationRepository.save(
      this.notificationRepository.create(notification),
    );
  }

  async getUserNotificationsAndCount(
    userId: number,
  ): Promise<[Notification[], number]> {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new UserDoesNotExistException();
    }

    return await this.notificationRepository.findAndCount({
      where: {
        user: { id: userId },
      },
      relations: ['user'],
      order: { created_at: 'DESC' },
    });
  }
}
