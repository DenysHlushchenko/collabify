/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationService } from './notification.service';
import { Notification } from './entities/notification.entity';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { NotFoundException } from '@nestjs/common';
import { UserDoesNotExistException } from 'src/shared/exceptions/UserDoesNotExist.exception';

describe('NotificationService', () => {
  let service: NotificationService;
  let notificationRepository: Repository<Notification>;
  let userService: UserService;

  const mockNotificationRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
    findAndCount: jest.fn(),
    delete: jest.fn(),
  };

  const mockUserService = {
    findById: jest.fn(),
  };

  const mockUser = { id: 7, username: 'alice' } as User;

  const mockNotification = {
    id: 1,
    message: 'John requested to join your post',
    user: mockUser,
    fromUser: { id: 8, username: 'john' } as User,
    created_at: new Date(),
  } as unknown as Notification;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationService,
        {
          provide: getRepositoryToken(Notification),
          useValue: mockNotificationRepository,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    service = module.get<NotificationService>(NotificationService);
    notificationRepository = module.get<Repository<Notification>>(
      getRepositoryToken(Notification),
    );
    userService = module.get<UserService>(UserService);

    jest.clearAllMocks();
  });

  describe('findById (private)', () => {
    it('should return notification when found', async () => {
      mockNotificationRepository.findOne.mockResolvedValue(mockNotification);

      const result = await (service as any).findById(1);

      expect(result).toEqual(mockNotification);
      expect(mockNotificationRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should return null when not found', async () => {
      mockNotificationRepository.findOne.mockResolvedValue(null);

      const result = await (service as any).findById(999);

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create and save a new notification', async () => {
      const input = {
        message: 'New join request',
        user: { id: 7 } as User,
        fromUser: { id: 8 } as User,
      };

      mockNotificationRepository.create.mockReturnValue({
        ...input,
        id: 42,
      });
      mockNotificationRepository.save.mockResolvedValue(undefined);

      await service.create(input as unknown as Notification);

      expect(mockNotificationRepository.create).toHaveBeenCalledWith(input);
      expect(mockNotificationRepository.save).toHaveBeenCalled();
    });
  });

  describe('getUserNotificationsAndCount', () => {
    it('should return notifications and count for existing user', async () => {
      mockUserService.findById.mockResolvedValue(mockUser);
      mockNotificationRepository.findAndCount.mockResolvedValue([
        [mockNotification, { ...mockNotification, id: 2 }],
        2,
      ]);

      const [notifications, count] =
        await service.getUserNotificationsAndCount(7);

      expect(mockUserService.findById).toHaveBeenCalledWith(7);
      expect(mockNotificationRepository.findAndCount).toHaveBeenCalledWith({
        where: { user: { id: 7 } },
        relations: ['user', 'fromUser'],
        order: { created_at: 'DESC' },
      });

      expect(notifications).toHaveLength(2);
      expect(count).toBe(2);
    });

    it('should throw UserDoesNotExistException when user not found', async () => {
      mockUserService.findById.mockResolvedValue(null);

      await expect(service.getUserNotificationsAndCount(999)).rejects.toThrow(
        UserDoesNotExistException,
      );
    });
  });

  describe('delete', () => {
    it('should delete notification when it exists', async () => {
      mockNotificationRepository.findOne.mockResolvedValue(mockNotification);
      mockNotificationRepository.delete.mockResolvedValue(undefined);

      await service.delete(1);

      expect(mockNotificationRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockNotificationRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when notification does not exist', async () => {
      mockNotificationRepository.findOne.mockResolvedValue(null);

      await expect(service.delete(999)).rejects.toThrow(NotFoundException);
      expect(mockNotificationRepository.delete).not.toHaveBeenCalled();
    });
  });
});
