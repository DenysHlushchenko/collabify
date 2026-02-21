/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ChatService } from './chat.service';
import { Chat } from './entities/chat.entity';
import { ChatMember } from './entities/chat_members.entity';
import { Repository } from 'typeorm';

describe('ChatService → getAllChatsByUserId', () => {
  let service: ChatService;
  let chatRepo: jest.Mocked<Repository<Chat>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatService,
        {
          provide: getRepositoryToken(Chat),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(ChatMember),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ChatService>(ChatService);
    chatRepo = module.get(getRepositoryToken(Chat));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllChatsByUserId', () => {
    const userId = 10;

    const mockUser = {
      id: 10,
      username: 'alice',
      gender: 'female',
      reputation: 42,
    };

    const mockPostOwner = {
      id: 5,
      username: 'bob',
      gender: 'male',
      reputation: 100,
    };

    const mockChatsFromDb = [
      {
        id: 100,
        title: 'Trip to mountains',
        created_at: new Date('2025-03-10'),
        max_members: 4,
        post: {
          id: 15,
          title: 'Looking for hiking buddies',
          user: mockPostOwner,
        },
        members: [
          { id: 300, joined_at: new Date(), user: mockUser },
          {
            id: 301,
            joined_at: new Date(),
            user: { id: 11, username: 'carol' },
          },
        ],
        messages: [],
      },
      {
        id: 101,
        title: 'Board games evening',
        created_at: new Date('2025-04-02'),
        max_members: 6,
        post: {
          id: 16,
          title: 'Weekly board game meetup',
          user: mockUser,
        },
        members: [
          { id: 302, joined_at: new Date(), user: mockUser },
          {
            id: 303,
            joined_at: new Date(),
            user: { id: 12, username: 'dave' },
          },
        ],
        messages: [],
      },
    ] as unknown as Chat[];

    it('should return chats sorted by created_at DESC + add isOwner flag', async () => {
      chatRepo.find.mockResolvedValue(mockChatsFromDb);

      const result = await service.getAllChatsByUserId(userId);

      expect(chatRepo.find).toHaveBeenCalledWith({
        where: {
          members: {
            user: { id: userId },
          },
        },
        relations: {
          post: {
            user: true,
          },
          members: {
            user: true,
          },
        },
        select: {
          post: {
            id: true,
            title: true,
            user: true,
          },
          members: {
            id: true,
            joined_at: true,
            user: {
              id: true,
              username: true,
            },
          },
        },
        order: {
          created_at: 'DESC',
        },
      });

      expect(result).toHaveLength(2);

      expect(result[0].isOwner).toBe(false);
      expect(result[1].isOwner).toBe(true);

      const firstResult = result[0] as any;
      expect(firstResult.post.user).not.toHaveProperty('email');
      expect(firstResult.members[0].user).not.toHaveProperty('email');
      expect(firstResult.members[0].user).not.toHaveProperty('password');
    });

    it('should return empty array when user has no chats', async () => {
      chatRepo.find.mockResolvedValue([]);

      const result = await service.getAllChatsByUserId(999);

      expect(result).toEqual([]);
      expect(chatRepo.find).toHaveBeenCalled();
    });

    it('should still map isOwner correctly even when user is not in members list (edge case)', async () => {
      const weirdChat = [
        {
          id: 200,
          title: 'Ghost chat?',
          created_at: new Date(),
          max_members: 2,
          post: {
            id: 30,
            title: 'Test',
            user: { id: userId, username: 'owner' },
          },
          members: [],
          messages: [],
        },
      ] as unknown as Chat[];

      chatRepo.find.mockResolvedValue(weirdChat);

      const result = await service.getAllChatsByUserId(userId);

      expect(result[0].isOwner).toBe(true);
    });
  });
});
