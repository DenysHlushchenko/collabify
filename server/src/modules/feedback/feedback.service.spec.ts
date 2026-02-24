import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { FeedbackService } from './feedback.service';
import { Feedback } from './entities/feedback.entity';
import { UserService } from '../user/user.service';
import { CreateFeedbackDto } from './dtos/CreateFeedback.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { User } from '../user/entities/user.entity';

describe('FeedbackService', () => {
  let feedbackService: FeedbackService;

  let mockFeedbackRepository: {
    create: jest.Mock;
    save: jest.Mock;
    find: jest.Mock;
  };

  let mockUserService: {
    findById: jest.Mock;
    updateReputationAsAverage: jest.Mock;
  };

  beforeEach(async () => {
    mockFeedbackRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
    };

    mockUserService = {
      findById: jest.fn(),
      updateReputationAsAverage: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FeedbackService,
        {
          provide: getRepositoryToken(Feedback),
          useValue: mockFeedbackRepository,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    feedbackService = module.get<FeedbackService>(FeedbackService);
  });

  it('should be defined', () => {
    expect(feedbackService).toBeDefined();
  });

  describe('create', () => {
    const validDto: CreateFeedbackDto = {
      senderId: 5,
      receiverId: 7,
      message: 'Great help!',
      rating: 4,
    };

    const sender = { id: 5, username: 'alice' } as User;
    const receiver = { id: 7, username: 'bob' } as User;

    it('should create feedback and update reputation when data is valid', async () => {
      mockUserService.findById
        .mockResolvedValueOnce(sender) // sender
        .mockResolvedValueOnce(receiver); // receiver

      const createdFeedbackEntity = {
        id: 42,
        message: validDto.message,
        rating: validDto.rating,
        sender,
        user: receiver,
      };

      mockFeedbackRepository.create.mockReturnValue(createdFeedbackEntity);
      mockFeedbackRepository.save.mockResolvedValue(createdFeedbackEntity);

      await feedbackService.create(validDto);

      expect(mockUserService.findById).toHaveBeenCalledWith(5);
      expect(mockUserService.findById).toHaveBeenCalledWith(7);
      expect(mockFeedbackRepository.create).toHaveBeenCalledWith({
        message: validDto.message,
        rating: validDto.rating,
        sender,
        user: receiver,
      });
      expect(mockFeedbackRepository.save).toHaveBeenCalledWith(
        createdFeedbackEntity,
      );
      expect(mockUserService.updateReputationAsAverage).toHaveBeenCalledWith(7);
    });

    it('should throw NotFoundException when sender does not exist', async () => {
      mockUserService.findById
        .mockResolvedValueOnce(null) // sender missing
        .mockResolvedValueOnce(receiver);

      await expect(feedbackService.create(validDto)).rejects.toThrow(
        NotFoundException,
      );

      expect(mockFeedbackRepository.save).not.toHaveBeenCalled();
      expect(mockUserService.updateReputationAsAverage).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when receiver does not exist', async () => {
      mockUserService.findById
        .mockResolvedValueOnce(sender)
        .mockResolvedValueOnce(null); // receiver missing

      await expect(feedbackService.create(validDto)).rejects.toThrow(
        NotFoundException,
      );

      expect(mockFeedbackRepository.save).not.toHaveBeenCalled();
      expect(mockUserService.updateReputationAsAverage).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when sender and receiver are the same', async () => {
      const selfDto: CreateFeedbackDto = { ...validDto, receiverId: 5 };

      mockUserService.findById.mockResolvedValue(sender);

      await expect(feedbackService.create(selfDto)).rejects.toThrow(
        new BadRequestException('Sender and receiver cannot be the same user'),
      );

      expect(mockFeedbackRepository.save).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when rating is invalid (0)', async () => {
      const invalidDto: CreateFeedbackDto = { ...validDto, rating: 0 };

      mockUserService.findById
        .mockResolvedValueOnce(sender)
        .mockResolvedValueOnce(receiver);

      await expect(feedbackService.create(invalidDto)).rejects.toThrow(
        new BadRequestException('Rating must be between 1 and 5'),
      );

      expect(mockFeedbackRepository.save).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when rating is invalid (6)', async () => {
      const invalidDto: CreateFeedbackDto = { ...validDto, rating: 6 };

      mockUserService.findById
        .mockResolvedValueOnce(sender)
        .mockResolvedValueOnce(receiver);

      await expect(feedbackService.create(invalidDto)).rejects.toThrow(
        new BadRequestException('Rating must be between 1 and 5'),
      );

      expect(mockFeedbackRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('getAllFeedbacksByUserId', () => {
    const userId = 7;
    const receiver = { id: 7, username: 'bob' } as User;

    const mockFeedbacks = [
      {
        id: 1,
        message: 'Nice!',
        rating: 5,
        sender: { id: 3, username: 'charlie' },
        user: receiver,
      },
      {
        id: 2,
        message: 'Could be better',
        rating: 3,
        sender: { id: 4, username: 'dave' },
        user: receiver,
      },
    ] as Feedback[];

    it('should return all feedback for existing user with sender relation', async () => {
      mockUserService.findById.mockResolvedValue(receiver);
      mockFeedbackRepository.find.mockResolvedValue(mockFeedbacks);

      const result = await feedbackService.getAllFeedbacksByUserId(userId);

      expect(mockUserService.findById).toHaveBeenCalledWith(userId);
      expect(mockFeedbackRepository.find).toHaveBeenCalledWith({
        where: { user: { id: userId } },
        relations: { sender: true },
      });
      expect(result).toEqual(mockFeedbacks);
    });

    it('should throw NotFoundException when user does not exist', async () => {
      mockUserService.findById.mockResolvedValue(null);

      await expect(
        feedbackService.getAllFeedbacksByUserId(999),
      ).rejects.toThrow(NotFoundException);

      expect(mockFeedbackRepository.find).not.toHaveBeenCalled();
    });
  });
});
