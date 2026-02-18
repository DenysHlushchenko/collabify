/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { PostService } from './post.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dtos/CreatePost.dto';
import { UserService } from 'src/modules/user/user.service';
import { UserDoesNotExistException } from 'src/shared/exceptions/UserDoesNotExist.exception';

describe('PostService', () => {
  let postService: PostService;

  let mockPostRepository: {
    save: jest.Mock;
    create: jest.Mock;
    find: jest.Mock;
  };

  let mockUserSevice: {
    findById: jest.Mock;
  };

  beforeEach(async () => {
    mockPostRepository = {
      save: jest.fn(),
      create: jest.fn(),
      find: jest.fn(),
    };

    mockUserSevice = {
      findById: jest.fn(),
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
    };

    it('should create and save a post when user exists', async () => {
      const mockUser = { id: 1 };
      const createdPost = { id: 10 };

      mockUserSevice.findById.mockResolvedValue(mockUser);
      mockPostRepository.create.mockReturnValue(createdPost);
      mockPostRepository.save.mockResolvedValue(createdPost);

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
    });

    it('should throw UserDoesNotExistException when user is not found', async () => {
      mockUserSevice.findById.mockResolvedValue(null);

      await expect(postService.create(dto)).rejects.toThrow(
        UserDoesNotExistException,
      );

      expect(mockPostRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('GET /posts', () => {
    const posts = [{ id: 1 }, { id: 2 }];

    it('should return all posts with user relations', async () => {
      mockPostRepository.find.mockResolvedValue(posts);

      const result = await postService.getAll();

      expect(mockPostRepository.find).toHaveBeenCalledWith({
        relations: ['user', 'postTags', 'comments'],
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
