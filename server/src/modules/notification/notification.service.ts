import { Injectable, NotFoundException } from '@nestjs/common';
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

  /**
   * Finds a notification by ID.
   * @param id
   * @returns either an existing notification or null.
   */
  async findById(id: number): Promise<Notification | null> {
    return await this.notificationRepository.findOne({
      where: {
        id,
      },
    });
  }

  async findByUserId(userId: number): Promise<Notification | null> {
    return await this.notificationRepository.findOne({
      where: {
        user: { id: userId },
      },
      relations: ['user'],
    });
  }

  /**
   * Creates a new notification, saving join request user and post author IDs.
   * @param notification
   */
  async create(notification: Notification): Promise<void> {
    await this.notificationRepository.save(
      this.notificationRepository.create(notification),
    );
  }

  /**
   * Finds all user's notifications and counts their occurances from the database.
   * @param userId
   * @returns an array that holds list of notifications, combining post author and joiner instances in descending order, and a total count of existing notifications.
   */
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
      relations: ['user', 'fromUser'],
      order: { created_at: 'DESC' },
    });
  }

  /**
   * Deletes a notification by ID from the database.
   * @param notificationId
   */
  async delete(notificationId: number): Promise<void> {
    const notification = await this.findById(notificationId);
    if (!notification) {
      throw new NotFoundException('Notification does not exist');
    }

    await this.notificationRepository.delete(notificationId);
  }
}
