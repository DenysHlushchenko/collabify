/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatService } from './chat.service';
import { Chat } from './entities/chat.entity';
import { ChatMember } from './entities/chat_members.entity';
import { PostService } from '../post/post.service';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

describe('ChatService', () => {
  let service: ChatService;
  let chatRepository: jest.Mocked<Repository<Chat>>;
  let chatMemberRepository: jest.Mocked<Repository<ChatMember>>;
  let postService: jest.Mocked<PostService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatService,
        {
          provide: getRepositoryToken(Chat),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            findOneOrFail: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
            createQueryBuilder: jest.fn(() => ({
              innerJoin: jest.fn().mockReturnThis(),
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              relation: jest.fn().mockReturnThis(),
              of: jest.fn().mockReturnThis(),
              add: jest.fn().mockReturnThis(),
              remove: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              getOne: jest.fn(),
              getCount: jest.fn(),
            })),
          },
        },
        {
          provide: getRepositoryToken(ChatMember),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
            createQueryBuilder: jest.fn(() => ({
              delete: jest.fn().mockReturnThis(),
              from: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              execute: jest.fn(),
            })),
          },
        },
        {
          provide: PostService,
          useValue: {
            deletePost: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ChatService>(ChatService);
    chatRepository = module.get(getRepositoryToken(Chat));
    chatMemberRepository = module.get(getRepositoryToken(ChatMember));
    postService = module.get(PostService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllChatsByUserId', () => {
    const userId = 10;

    const mockUser = { id: 10, username: 'alice' };
    const mockOtherUser = { id: 11, username: 'bob' };

    const mockChats = [
      {
        id: 100,
        title: 'Mountain trip',
        created_at: new Date('2025-03-10'),
        max_members: 5,
        posts: [
          { id: 15, title: 'Hiking', user: { id: 7, username: 'carol' } },
        ],
        members: [
          { id: 200, joined_at: new Date(), user: mockUser },
          { id: 201, joined_at: new Date(), user: mockOtherUser },
        ],
      },
      {
        id: 101,
        title: 'Board games',
        created_at: new Date('2025-04-01'),
        max_members: 6,
        posts: [{ id: 16, title: 'Game night', user: mockUser }],
        members: [{ id: 202, joined_at: new Date(), user: mockUser }],
      },
    ] as unknown as Chat[];

    it('returns chats sorted by created_at DESC and adds isOwner flag', async () => {
      chatRepository.find.mockResolvedValue(mockChats);

      const result = await service.getAllChatsByUserId(userId);

      expect(chatRepository.find).toHaveBeenCalledWith({
        where: { members: { user: { id: userId } } },
        relations: {
          posts: { user: true },
          members: { user: true },
        },
        select: {
          posts: { id: true, title: true, user: true },
          members: {
            id: true,
            joined_at: true,
            user: { id: true, username: true },
          },
        },
        order: { created_at: 'DESC' },
      });

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe(100);
      expect(result[0].isOwner).toBe(false);
      expect(result[1].id).toBe(101);
      expect(result[1].isOwner).toBe(true);

      expect(result[0].posts[0].user).not.toHaveProperty('email');
      expect(result[0].members[0].user).not.toHaveProperty('password');
    });

    it('returns empty array when user has no chats', async () => {
      chatRepository.find.mockResolvedValue([]);
      const result = await service.getAllChatsByUserId(999);
      expect(result).toEqual([]);
    });

    it('correctly sets isOwner when user is owner via post but not in members (edge case)', async () => {
      const weirdChat = [
        {
          id: 300,
          title: 'Ghost chat',
          created_at: new Date(),
          posts: [{ id: 40, title: 'Test', user: mockUser }],
          members: [],
        },
      ] as unknown as Chat[];

      chatRepository.find.mockResolvedValue(weirdChat);

      const result = await service.getAllChatsByUserId(userId);
      expect(result[0].isOwner).toBe(true);
    });
  });

  describe('create', () => {
    it('creates chat with multiple postIds', async () => {
      const dto = {
        title: 'Weekend trip',
        postIds: [5, 6],
        max_members: 8,
      };

      const createdEntity = { id: 77, ...dto, created_at: expect.any(Date) };
      chatRepository.create.mockReturnValue(createdEntity as any);
      chatRepository.save.mockResolvedValue({
        ...createdEntity,
        id: 77,
      } as any);

      const result = await service.create(dto);

      expect(chatRepository.create).toHaveBeenCalledWith({
        title: dto.title,
        posts: [{ id: 5 }, { id: 6 }],
        max_members: dto.max_members,
        created_at: expect.any(Date),
      });

      expect(result.id).toBe(77);
    });
  });

  describe('makeUserMemberOfChat', () => {
    it('adds user if not already member', async () => {
      chatMemberRepository.findOne.mockResolvedValue(null);

      const memberEntity = { id: 500 };
      chatMemberRepository.create.mockReturnValue(memberEntity as any);
      chatMemberRepository.save.mockResolvedValue(memberEntity as any);

      await service.makeUserMemberOfChat(10, 100);

      expect(chatMemberRepository.findOne).toHaveBeenCalled();
      expect(chatMemberRepository.create).toHaveBeenCalled();
      expect(chatMemberRepository.save).toHaveBeenCalled();
    });

    it('does nothing if user is already member', async () => {
      chatMemberRepository.findOne.mockResolvedValue({ id: 501 } as any);

      await service.makeUserMemberOfChat(10, 100);

      expect(chatMemberRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('deleteChat', () => {
    const chatId = 55;
    const ownerId = 10;

    const mockChat = {
      id: chatId,
      posts: [
        { id: 20, user: { id: 10 } },
        { id: 21, user: { id: 10 } },
      ],
      members: [{ id: 300 }, { id: 301 }],
    } as unknown as Chat;

    it('deletes chat when user is owner', async () => {
      chatRepository.findOne.mockResolvedValue(mockChat);
      chatMemberRepository.delete.mockResolvedValue({ affected: 2 } as any);

      await service.deleteChat(chatId, ownerId);

      expect(postService.deletePost).toHaveBeenCalledTimes(2);
      expect(chatRepository.delete).toHaveBeenCalledWith(chatId);
    });

    it('throws ForbiddenException when user is not owner', async () => {
      chatRepository.findOne.mockResolvedValue({
        ...mockChat,
        posts: [{ id: 22, user: { id: 999 } as const }],
      } as Chat);

      await expect(service.deleteChat(chatId, ownerId)).rejects.toThrow(
        ForbiddenException,
      );
      expect(chatRepository.delete).not.toHaveBeenCalled();
    });

    it('throws NotFoundException when chat does not exist', async () => {
      chatRepository.findOne.mockResolvedValue(null);
      await expect(service.deleteChat(chatId, ownerId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
