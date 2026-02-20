import { Test, TestingModule } from '@nestjs/testing';
import { PostService } from './post.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dtos/CreatePost.dto';
import { UserService } from 'src/modules/user/user.service';
import { UserDoesNotExistException } from 'src/shared/exceptions/UserDoesNotExist.exception';
import { ChatService } from '../chat/chat.service';
import { TagService } from '../tag/tag.service';
import { PostTag } from '../tag/entities/post_tag.entity';

describe('PostService', () => {
  let postService: PostService;

  let mockPostRepository: {
    save: jest.Mock;
    create: jest.Mock;
    find: jest.Mock;
    createQueryBuilder: jest.Mock;
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
      createQueryBuilder: jest.fn(),
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
  });

  describe('GET /posts with search and filter', () => {
    const mockUser = {
      id: 5,
      username: 'tester',
      gender: 'other',
      reputation: 42,
      email: 'test@example.com',
      created_at: new Date('2025-01-10'),
      updated_at: new Date('2025-02-15'),
    };

    const mockPosts = [
      {
        id: 100,
        title: 'Best hiking trails in Europe',
        created_at: new Date('2026-01-05'),
        user: mockUser,
        postTags: [{ tag: { name: 'travel' } }, { tag: { name: 'outdoor' } }],
        comments: [],
      },
      {
        id: 101,
        title: 'How to cook perfect pasta',
        created_at: new Date('2026-02-01'),
        user: mockUser,
        postTags: [{ tag: { name: 'cooking' } }, { tag: { name: 'italian' } }],
        comments: [{ id: 1 }],
      },
      {
        id: 102,
        title: 'Travel tips for Japan 2026',
        created_at: new Date('2026-02-10'),
        user: mockUser,
        postTags: [{ tag: { name: 'travel' } }],
        comments: [],
      },
    ];

    let qb: Record<string, jest.Mock>;

    beforeEach(() => {
      qb = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockPosts),
      };
      mockPostRepository.createQueryBuilder.mockReturnValue(qb);
    });

    it('should sort DESC by default (newest first)', async () => {
      const result = await postService.getAll();

      expect(mockPostRepository.createQueryBuilder).toHaveBeenCalledWith(
        'post',
      );
      expect(qb.leftJoinAndSelect).toHaveBeenCalledWith('post.user', 'user');
      expect(qb.leftJoinAndSelect).toHaveBeenCalledWith(
        'post.postTags',
        'postTags',
      );
      expect(qb.leftJoinAndSelect).toHaveBeenCalledWith('postTags.tag', 'tag');
      expect(qb.leftJoinAndSelect).toHaveBeenCalledWith(
        'post.comments',
        'comments',
      );
      expect(qb.where).not.toHaveBeenCalled();
      expect(qb.orderBy).toHaveBeenCalledWith('post.created_at', 'DESC');
      expect(qb.getMany).toHaveBeenCalled();
      expect(result).toEqual(mockPosts);
    });

    it('should sort ASC when specified', async () => {
      await postService.getAll({ sort: 'ASC' });

      expect(qb.orderBy).toHaveBeenCalledWith('post.created_at', 'ASC');
    });

    it('should apply search filter with ILIKE when search term is provided', async () => {
      await postService.getAll({ search: 'travel' });

      expect(qb.where).toHaveBeenCalledWith(
        '(post.title ILIKE :search OR tag.name ILIKE :search)',
        { search: '%travel%' },
      );
      expect(qb.orderBy).toHaveBeenCalledWith('post.created_at', 'DESC');
    });

    it('should apply both search and custom sort', async () => {
      await postService.getAll({ search: 'hiking', sort: 'ASC' });

      expect(qb.where).toHaveBeenCalledWith(
        '(post.title ILIKE :search OR tag.name ILIKE :search)',
        { search: '%hiking%' },
      );
      expect(qb.orderBy).toHaveBeenCalledWith('post.created_at', 'ASC');
    });

    it('should return empty array when no posts match', async () => {
      qb.getMany.mockResolvedValue([]);

      const result = await postService.getAll({ search: 'nonexistent' });

      expect(result).toEqual([]);
    });
  });
});
