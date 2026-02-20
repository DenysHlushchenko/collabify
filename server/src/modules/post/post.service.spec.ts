/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { PostService } from './post.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dtos/CreatePost.dto';
import { UserService } from 'src/modules/user/user.service';
import { UserDoesNotExistException } from 'src/shared/exceptions/UserDoesNotExist.exception';
import { ChatService } from '../chat/chat.service';
import { TagService } from '../tag/tag.service';
import { BadRequestException } from '@nestjs/common';
import { PostTag } from '../tag/entities/post_tag.entity';

describe('PostService', () => {
  let postService: PostService;

  let mockPostRepository: {
    save: jest.Mock;
    create: jest.Mock;
    find: jest.Mock;
    manager: {
      getRepository: jest.Mock;
    };
  };

  let mockUserSevice: {
    findById: jest.Mock;
  };

  let mockChatService: {
    findById: jest.Mock;
    create: jest.Mock;
    makeUserMemberOfChat: jest.Mock;
  };

  let mockTagService: {
    findOrCreateMany: jest.Mock;
  };

  beforeEach(async () => {
    mockPostRepository = {
      save: jest.fn(),
      create: jest.fn(),
      find: jest.fn(),
      manager: {
        getRepository: jest.fn(),
      },
    };

    mockUserSevice = {
      findById: jest.fn(),
    };

    mockChatService = {
      findById: jest.fn(),
      create: jest.fn(),
      makeUserMemberOfChat: jest.fn(),
    };

    mockTagService = {
      findOrCreateMany: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        {
          provide: getRepositoryToken(Post),
          useValue: mockPostRepository,
        },
        {
          provide: UserService,
          useValue: mockUserSevice,
        },
        {
          provide: ChatService,
          useValue: mockChatService,
        },
        {
          provide: TagService,
          useValue: mockTagService,
        },
      ],
    }).compile();

    postService = module.get<PostService>(PostService);
  });

  it('should be defined', () => {
    expect(postService).toBeDefined();
  });

  it('userRepository should be defined', () => {
    expect(mockPostRepository).toBeDefined();
  });

  describe('POST /posts', () => {
    const dto: CreatePostDto = {
      title: 'titleTest',
      description: 'descriptionTest',
      groupSize: 2,
      userId: 1,
      chatTitle: 'Test Chat',
      tags: ['tag1', 'tag2'],
    };

    it('should create and save a post when user exists', async () => {
      const mockUser = { id: 1 };
      const createdPost = { id: 10 };
      const createdChat = { id: 99 };

      const mockPostTagRepo = {
        create: jest.fn((data: Partial<PostTag>) => data as PostTag),
        save: jest.fn().mockResolvedValue([] as PostTag[]),
      };

      mockPostRepository.manager.getRepository.mockReturnValue(mockPostTagRepo);

      mockUserSevice.findById.mockResolvedValue(mockUser);
      mockPostRepository.create.mockReturnValue(createdPost);
      mockPostRepository.save.mockResolvedValue(createdPost);

      mockTagService.findOrCreateMany.mockResolvedValue([]);
      mockChatService.create.mockResolvedValue(createdChat);
      mockChatService.makeUserMemberOfChat.mockResolvedValue(undefined);

      await postService.create(dto);

      expect(mockUserSevice.findById).toHaveBeenCalledWith(dto.userId);

      expect(mockPostRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          title: dto.title,
          description: dto.description,
          group_size: dto.groupSize,
          user: { id: dto.userId },
        }),
      );

      expect(mockPostRepository.save).toHaveBeenCalledWith(createdPost);

      expect(mockChatService.create).toHaveBeenCalledWith({
        postId: createdPost.id,
        title: dto.chatTitle,
        max_members: dto.groupSize,
      });

      expect(mockChatService.makeUserMemberOfChat).toHaveBeenCalledWith(
        dto.userId,
        createdChat.id,
      );
    });

    it('should throw UserDoesNotExistException when user is not found', async () => {
      mockUserSevice.findById.mockResolvedValue(null);

      await expect(postService.create(dto)).rejects.toThrow(
        UserDoesNotExistException,
      );

      expect(mockPostRepository.save).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException if both chatId and chatTitle are provided', async () => {
      mockUserSevice.findById.mockResolvedValue({ id: 1 });

      await expect(
        postService.create({
          ...dto,
          chatId: 1,
          chatTitle: 'Chat',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if neither chatId nor chatTitle is provided', async () => {
      mockUserSevice.findById.mockResolvedValue({ id: 1 });

      await expect(
        postService.create({
          title: 'titleTest',
          description: 'descriptionTest',
          groupSize: 2,
          userId: 1,
        } as CreatePostDto),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('GET /posts', () => {
    const posts = [{ id: 1 }, { id: 2 }];

    it('should return all posts with user relations', async () => {
      mockPostRepository.find.mockResolvedValue(posts);

      const result = await postService.getAll();

      expect(mockPostRepository.find).toHaveBeenCalledWith({
        relations: {
          user: true,
          postTags: {
            tag: true,
          },
          comments: true,
        },
        select: {
          user: {
            id: true,
            username: true,
            gender: true,
            reputation: true,
            email: true,
            created_at: true,
            updated_at: true,
          },
        },
      });
      expect(result).toEqual(posts);
    });
  });
});
