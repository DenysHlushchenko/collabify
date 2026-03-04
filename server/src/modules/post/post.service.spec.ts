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
import { PostTag } from '../tag/entities/post_tag.entity';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { VoteService } from 'src/shared/vote/vote.service';
import { mockDataSourceProvider } from '../../../test/mocks/data-source.mock';
import { CommentService } from '../comment/comment.service';

describe('PostService', () => {
  let postService: PostService;

  let mockPostRepository: {
    save: jest.Mock;
    create: jest.Mock;
    find: jest.Mock;
    findOneOrFail: jest.Mock;
    delete: jest.Mock;
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
    delete: jest.Mock;
  };

  let mockCommentService: {
    getAllCommentsByPostId: jest.Mock;
    deleteComment: jest.Mock;
  };

  beforeEach(async () => {
    mockPostRepository = {
      save: jest.fn(),
      create: jest.fn(),
      find: jest.fn(),
      findOneOrFail: jest.fn(),
      delete: jest.fn(),
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

    mockCommentService = {
      getAllCommentsByPostId: jest.fn(),
      deleteComment: jest.fn(),
    };

    mockTagService = {
      findOrCreateMany: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        VoteService,
        mockDataSourceProvider,
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
        {
          provide: CommentService,
          useValue: mockCommentService,
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

  describe('GET /posts/users/:userId', () => {
    const mockUser = {
      id: 999,
      username: 'testerTwo',
      gender: 'female',
      reputation: 24,
      email: 'testTwo@example.com',
      created_at: new Date('2026-01-10'),
      updated_at: new Date('2026-02-15'),
    };

    const mockPosts = [
      {
        id: 103,
        title: 'Best hiking trails in Europe',
        created_at: new Date('2026-01-11'),
        user: mockUser,
        postTags: [{ tag: { name: 'travel' } }, { tag: { name: 'outdoor' } }],
        comments: [],
      },
      {
        id: 104,
        title: 'How to cook perfect pasta',
        created_at: new Date('2026-02-01'),
        user: mockUser,
        postTags: [{ tag: { name: 'cooking' } }, { tag: { name: 'italian' } }],
        comments: [{ id: 1 }],
      },
      {
        id: 105,
        title: 'Travel tips for Japan 2026',
        created_at: new Date('2026-01-28'),
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
      mockUserSevice.findById.mockResolvedValue(mockUser);
      mockPostRepository.createQueryBuilder.mockReturnValue(qb);
    });

    it('should be defined', () => {
      expect(postService.getAllPostsByUserId).toBeDefined();
    });

    it('should return posts for existing user', async () => {
      const result = await postService.getAllPostsByUserId({}, 999);

      expect(mockUserSevice.findById).toHaveBeenCalledWith(999);
      expect(mockPostRepository.createQueryBuilder).toHaveBeenCalledWith(
        'post',
      );

      expect(qb.leftJoinAndSelect).toHaveBeenCalledWith('post.user', 'user');
      expect(qb.leftJoinAndSelect).toHaveBeenCalledWith(
        'user.country',
        'country',
      );
      expect(qb.leftJoinAndSelect).toHaveBeenCalledWith(
        'post.postTags',
        'postTags',
      );
      expect(qb.leftJoinAndSelect).toHaveBeenCalledWith('postTags.tag', 'tag');
      expect(qb.leftJoinAndSelect).toHaveBeenCalledWith(
        'post.comments',
        'comments',
      );

      expect(qb.where).toHaveBeenCalledWith('post.user_id = :userId', {
        userId: 999,
      });
      expect(qb.orderBy).toHaveBeenCalledWith('post.created_at', 'DESC');
      expect(qb.getMany).toHaveBeenCalled();

      expect(result).toEqual(mockPosts);
      expect(result[0].id).toBe(103);
    });

    it('should apply ASC sort when requested', async () => {
      await postService.getAllPostsByUserId({ sort: 'ASC' }, 999);

      expect(qb.orderBy).toHaveBeenCalledWith('post.created_at', 'ASC');
    });

    it('should apply search filter (on title and tags) when search term is provided', async () => {
      await postService.getAllPostsByUserId({ search: 'travel' }, 999);

      expect(qb.where).toHaveBeenNthCalledWith(1, 'post.user_id = :userId', {
        userId: 999,
      });
      expect(qb.where).toHaveBeenNthCalledWith(
        2,
        '(post.title ILIKE :search OR tag.name ILIKE :search)',
        { search: '%travel%' },
      );
      expect(qb.orderBy).toHaveBeenCalledWith('post.created_at', 'DESC');
    });

    it('should combine search + custom sort correctly', async () => {
      await postService.getAllPostsByUserId(
        { search: 'pasta', sort: 'ASC' },
        999,
      );

      expect(qb.where).toHaveBeenNthCalledWith(1, 'post.user_id = :userId', {
        userId: 999,
      });
      expect(qb.where).toHaveBeenNthCalledWith(
        2,
        '(post.title ILIKE :search OR tag.name ILIKE :search)',
        { search: '%pasta%' },
      );
      expect(qb.orderBy).toHaveBeenCalledWith('post.created_at', 'ASC');
    });

    it('should throw UserDoesNotExistException when user is not found', async () => {
      mockUserSevice.findById.mockResolvedValue(null);

      await expect(postService.getAllPostsByUserId({}, 999)).rejects.toThrow(
        UserDoesNotExistException,
      );

      expect(mockPostRepository.createQueryBuilder).not.toHaveBeenCalled();
    });

    it('should return empty array when user exists but has no posts', async () => {
      qb.getMany.mockResolvedValue([]);

      const result = await postService.getAllPostsByUserId(
        { sort: 'DESC' },
        999,
      );

      expect(result).toEqual([]);
      expect(qb.where).toHaveBeenCalledWith('post.user_id = :userId', {
        userId: 999,
      });
    });

    it('should still apply search even when no posts match', async () => {
      qb.getMany.mockResolvedValue([]);

      const result = await postService.getAllPostsByUserId(
        { search: 'nonexistent' },
        999,
      );

      expect(result).toEqual([]);
      expect(qb.where).toHaveBeenCalledTimes(2);
    });
  });

  describe('PUT /posts/:id', () => {
    const mockUser = {
      id: 777,
      username: 'updater',
      gender: 'male',
      reputation: 88,
      email: 'update@example.com',
      created_at: new Date('2026-02-10'),
      updated_at: new Date('2026-02-20'),
    };

    const existingPost = {
      id: 42,
      title: 'Old Title - Learn NestJS',
      description: 'Old boring description...',
      group_size: 5,
      user: mockUser,
      postTags: [
        { id: 1, tag: { id: 10, name: 'nestjs' } },
        { id: 2, tag: { id: 11, name: 'backend' } },
      ],
      comments: [],
      created_at: new Date('2026-02-05'),
      updated_at: new Date('2026-02-15'),
    };

    const mockPostTagRepo = {
      delete: jest.fn().mockResolvedValue({ affected: 2 }),
      save: jest.fn().mockResolvedValue([]),
      count: jest.fn(),
    };

    beforeEach(() => {
      jest.clearAllMocks();

      mockUserSevice.findById.mockResolvedValue(mockUser);
      jest
        .spyOn(postService, 'getPostById')
        .mockResolvedValue(existingPost as unknown as Post);
      mockPostRepository.manager.getRepository.mockReturnValue(mockPostTagRepo);
      mockPostRepository.save.mockResolvedValue({
        ...existingPost,
        updated_at: new Date(),
      });
    });

    it('should be defined', () => {
      expect(postService.updatePost).toBeDefined();
    });

    it('should successfully update post when valid DTO is provided', async () => {
      mockPostTagRepo.count.mockResolvedValueOnce(0).mockResolvedValueOnce(0);

      const dto = {
        title: 'Advanced NestJS - Real World Patterns',
        description:
          'Deep dive into advanced patterns, decorators, modules and CQRS',
        groupSize: 8,
        tags: ['nestjs', 'typescript', 'advanced'],
        userId: 777,
      };

      mockTagService.findOrCreateMany.mockResolvedValue([
        { id: 20, name: 'nestjs' },
        { id: 21, name: 'typescript' },
        { id: 22, name: 'advanced' },
      ]);

      await postService.updatePost(42, dto, mockUser.id);

      expect(mockUserSevice.findById).toHaveBeenCalledWith(777);
      expect(mockPostTagRepo.delete).toHaveBeenCalledWith({ post: { id: 42 } });

      expect(existingPost.postTags).toHaveLength(3);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
      expect(existingPost.postTags.map((pt: any) => pt.tag.name)).toEqual(
        expect.arrayContaining(['nestjs', 'typescript', 'advanced']),
      );

      expect(existingPost.title).toBe(dto.title);
      expect(existingPost.description).toBe(dto.description);
      expect(existingPost.group_size).toBe(dto.groupSize);

      expect(mockPostRepository.save).toHaveBeenCalledWith(existingPost);

      expect(mockTagService.delete).toHaveBeenCalledTimes(2);
      expect(mockTagService.delete).toHaveBeenCalledWith(10);
      expect(mockTagService.delete).toHaveBeenCalledWith(11);
    });

    it('should throw UserDoesNotExistException when user does not exist', async () => {
      mockPostTagRepo.count.mockResolvedValue(1);
      mockUserSevice.findById.mockResolvedValue(null);

      const dto = {
        title: 'New Title',
        description: 'New desc',
        groupSize: 6,
        tags: ['test'],
      };

      await expect(
        postService.updatePost(42, dto, mockUser.id),
      ).rejects.toThrow(UserDoesNotExistException);

      expect(mockPostTagRepo.delete).not.toHaveBeenCalled();
      expect(mockPostRepository.save).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when post does not exist', async () => {
      mockPostTagRepo.count.mockResolvedValue(1);
      jest.spyOn(postService, 'getPostById').mockResolvedValue(null);

      const dto = {
        title: 'New Title',
        description: 'New desc',
        groupSize: 6,
        tags: ['update'],
      };

      await expect(
        postService.updatePost(999, dto, mockUser.id),
      ).rejects.toThrow(NotFoundException);

      expect(mockPostTagRepo.delete).not.toHaveBeenCalled();
      expect(mockPostRepository.save).not.toHaveBeenCalled();
    });

    it('should allow minimum number of tags (1 tag)', async () => {
      mockPostTagRepo.count.mockResolvedValue(1);
      const dto = {
        title: 'Minimal tags update',
        description: 'Only one tag allowed',
        groupSize: 4,
        tags: ['important'],
      };

      mockTagService.findOrCreateMany.mockResolvedValue([
        { id: 30, name: 'important' },
      ]);

      await postService.updatePost(42, dto, mockUser.id);

      expect(mockPostTagRepo.delete).toHaveBeenCalled();
      expect(existingPost.postTags).toHaveLength(1);
      expect(mockPostRepository.save).toHaveBeenCalled();
    });

    it('should allow maximum number of tags (3 tags)', async () => {
      mockPostTagRepo.count.mockResolvedValue(1);
      const dto = {
        title: 'Max tags test',
        description: 'Testing limit',
        groupSize: 10,
        tags: ['tag1', 'tag2', 'tag3'],
      };

      mockTagService.findOrCreateMany.mockResolvedValue([
        { id: 31, name: 'tag1' },
        { id: 32, name: 'tag2' },
        { id: 33, name: 'tag3' },
      ]);

      await postService.updatePost(42, dto, mockUser.id);

      expect(existingPost.postTags).toHaveLength(3);
      expect(mockPostRepository.save).toHaveBeenCalled();
    });

    it('should update fields correctly even when tags are repeated', async () => {
      mockPostTagRepo.count.mockResolvedValue(1);
      const dto = {
        title: 'Repeated tags',
        description: 'Testing duplicates',
        groupSize: 3,
        tags: ['react', 'react', 'frontend'],
      };

      mockTagService.findOrCreateMany.mockResolvedValue([
        { id: 40, name: 'react' },
        { id: 40, name: 'react' },
        { id: 41, name: 'frontend' },
      ]);

      await postService.updatePost(42, dto, mockUser.id);

      expect(existingPost.postTags).toHaveLength(3);
      expect(mockPostRepository.save).toHaveBeenCalled();
    });

    it("should throw ForbiddenException when user tries to update another user's post", async () => {
      mockPostTagRepo.count.mockResolvedValue(1);
      const dto = {
        title: 'Unauthorized update',
        description: 'Should fail',
        groupSize: 5,
        tags: ['test'],
      };

      await expect(postService.updatePost(42, dto, 888)).rejects.toThrow(
        ForbiddenException,
      );

      expect(mockPostRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('DELETE /posts/:id', () => {
    const mockUser = {
      id: 777,
      username: 'updater',
      gender: 'male',
      reputation: 88,
      email: 'update@example.com',
      created_at: new Date('2026-02-10'),
      updated_at: new Date('2026-02-20'),
    };

    const existingPost = {
      id: 42,
      title: 'Old Title - Learn NestJS',
      description: 'Old boring description...',
      group_size: 5,
      user: mockUser,
      postTags: [
        { id: 1, tag: { id: 10, name: 'nestjs' } },
        { id: 2, tag: { id: 11, name: 'backend' } },
      ],
      comments: [],
      created_at: new Date('2026-02-05'),
      updated_at: new Date('2026-02-15'),
    };

    const mockPostTagRepo = {
      delete: jest.fn().mockResolvedValue({ affected: 2 }),
      count: jest.fn(),
    };

    beforeEach(() => {
      jest.clearAllMocks();

      mockUserSevice.findById.mockResolvedValue(mockUser);
      jest
        .spyOn(postService, 'getPostById')
        .mockResolvedValue(existingPost as unknown as Post);
      mockPostRepository.manager.getRepository.mockReturnValue(mockPostTagRepo);
      mockPostRepository.delete.mockResolvedValue({ affected: 1 });

      mockCommentService.getAllCommentsByPostId.mockResolvedValue([]);
      mockCommentService.deleteComment.mockResolvedValue(undefined);
    });

    it('should be defined', () => {
      expect(postService.deletePost).toBeDefined();
    });

    it('should successfully delete post + associated post_tags when post and user exist', async () => {
      await postService.deletePost(42, 777);

      expect(mockUserSevice.findById).toHaveBeenCalledWith(777);
      expect(postService.getPostById).toHaveBeenCalledWith(42);
      expect(mockPostTagRepo.delete).toHaveBeenCalledWith({ post: { id: 42 } });
      expect(mockPostRepository.delete).toHaveBeenCalledWith(42);
    });

    it('should throw UserDoesNotExistException when user does not exist', async () => {
      mockUserSevice.findById.mockResolvedValue(null);

      await expect(postService.deletePost(42, 999)).rejects.toThrow(
        UserDoesNotExistException,
      );

      expect(postService.getPostById).not.toHaveBeenCalled();
      expect(mockPostTagRepo.delete).not.toHaveBeenCalled();
      expect(mockPostRepository.delete).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when post does not exist', async () => {
      jest.spyOn(postService, 'getPostById').mockResolvedValue(null);

      await expect(postService.deletePost(999, 777)).rejects.toThrow(
        NotFoundException,
      );

      expect(mockUserSevice.findById).toHaveBeenCalledWith(777);
      expect(mockPostTagRepo.delete).not.toHaveBeenCalled();
      expect(mockPostRepository.delete).not.toHaveBeenCalled();
    });

    it('should still call delete even if there are no post tags', async () => {
      const postWithoutTags = {
        ...existingPost,
        postTags: [],
      };

      jest
        .spyOn(postService, 'getPostById')
        .mockResolvedValue(postWithoutTags as unknown as Post);

      await postService.deletePost(42, 777);

      expect(mockPostTagRepo.delete).toHaveBeenCalledWith({ post: { id: 42 } });
      expect(mockPostRepository.delete).toHaveBeenCalledWith(42);
    });

    it('should delete post + post_tags + call delete on each comment when comments exist', async () => {
      const comments = [
        { id: 300, sender: { id: 77 } },
        { id: 301, sender: { id: 88 } },
      ];

      mockCommentService.getAllCommentsByPostId.mockResolvedValue(comments);

      await postService.deletePost(42, 777);

      expect(mockCommentService.getAllCommentsByPostId).toHaveBeenCalledWith(
        42,
      );
      expect(mockCommentService.deleteComment).toHaveBeenCalledTimes(2);
      expect(mockCommentService.deleteComment).toHaveBeenNthCalledWith(
        1,
        300,
        77,
      );
      expect(mockCommentService.deleteComment).toHaveBeenNthCalledWith(
        2,
        301,
        88,
      );
      expect(mockPostTagRepo.delete).toHaveBeenCalledWith({ post: { id: 42 } });
      expect(mockPostRepository.delete).toHaveBeenCalledWith(42);
    });

    it('should not call deleteComment when there are no comments', async () => {
      mockCommentService.getAllCommentsByPostId.mockResolvedValue([]);

      await postService.deletePost(42, 777);

      expect(mockCommentService.deleteComment).not.toHaveBeenCalled();
      expect(mockPostRepository.delete).toHaveBeenCalledWith(42);
    });
  });
});
