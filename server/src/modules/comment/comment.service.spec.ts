import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CommentService } from './comment.service';
import { Comment } from './entities/comment.entity';
import { UserService } from '../user/user.service';
import { PostService } from '../post/post.service';
import { CreateCommentDto } from './dtos/CreateComment.dto';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { User } from '../user/entities/user.entity';
import { Post } from '../post/entities/post.entity';

describe('CommentService', () => {
  let commentService: CommentService;

  let mockCommentRepository: {
    create: jest.Mock;
    save: jest.Mock;
    find: jest.Mock;
    findOne: jest.Mock;
    delete: jest.Mock;
  };

  let mockUserService: {
    findById: jest.Mock;
  };

  let mockPostService: {
    getPostById: jest.Mock;
  };

  beforeEach(async () => {
    mockCommentRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      delete: jest.fn(),
    };

    mockUserService = {
      findById: jest.fn(),
    };

    mockPostService = {
      getPostById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentService,
        {
          provide: getRepositoryToken(Comment),
          useValue: mockCommentRepository,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: PostService,
          useValue: mockPostService,
        },
      ],
    }).compile();

    commentService = module.get<CommentService>(CommentService);
  });

  it('should be defined', () => {
    expect(commentService).toBeDefined();
  });

  describe('create', () => {
    const validDto: CreateCommentDto = {
      content: 'Nice post!',
      senderId: 10,
    };

    const mockSender = { id: 10, username: 'alice' } as User;
    const mockPost = {
      id: 18,
      title: 'Test Post',
      user: { id: 5 },
    } as Post;

    it('should create a comment when user and post exist', async () => {
      mockUserService.findById.mockResolvedValue(mockSender);
      mockPostService.getPostById.mockResolvedValue(mockPost);

      const createdEntity = {
        id: 55,
        message: validDto.content,
        sender: mockSender,
        post: mockPost,
      };

      mockCommentRepository.create.mockReturnValue(createdEntity);
      mockCommentRepository.save.mockResolvedValue(createdEntity);

      await commentService.create(validDto, mockPost.id);

      expect(mockUserService.findById).toHaveBeenCalledWith(validDto.senderId);
      expect(mockPostService.getPostById).toHaveBeenCalledWith(mockPost.id);

      expect(mockCommentRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          message: validDto.content,
          sender: mockSender,
          post: mockPost,
        }),
      );

      expect(mockCommentRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException when sender does not exist', async () => {
      mockUserService.findById.mockResolvedValue(null);

      await expect(commentService.create(validDto, 18)).rejects.toThrow(
        NotFoundException,
      );

      expect(mockCommentRepository.save).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when post does not exist', async () => {
      mockUserService.findById.mockResolvedValue(mockSender);
      mockPostService.getPostById.mockResolvedValue(null);

      await expect(commentService.create(validDto, 999)).rejects.toThrow(
        NotFoundException,
      );

      expect(mockCommentRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('getAllCommentsByPostId', () => {
    const postId = 18;

    const mockPost = { id: postId } as Post;

    const mockComments = [
      {
        id: 55,
        message: 'Great!',
        created_at: new Date(),
        sender: { id: 10, username: 'alice' },
        post: mockPost,
      },
      {
        id: 56,
        message: 'Thanks for sharing',
        created_at: new Date(),
        sender: { id: 12, username: 'bob' },
        post: mockPost,
      },
    ] as Comment[];

    it('should return comments with sender relation when post exists', async () => {
      mockPostService.getPostById.mockResolvedValue(mockPost);
      mockCommentRepository.find.mockResolvedValue(mockComments);

      const result = await commentService.getAllCommentsByPostId(postId);

      expect(mockPostService.getPostById).toHaveBeenCalledWith(postId);
      expect(mockCommentRepository.find).toHaveBeenCalledWith({
        where: { post: { id: postId } },
        relations: {
          sender: true,
        },
        order: {
          created_at: 'DESC',
        },
      });

      expect(result).toEqual(mockComments);
    });

    it('should throw NotFoundException when post does not exist', async () => {
      mockPostService.getPostById.mockResolvedValue(null);

      await expect(commentService.getAllCommentsByPostId(999)).rejects.toThrow(
        NotFoundException,
      );

      expect(mockCommentRepository.find).not.toHaveBeenCalled();
    });
  });

  describe('deleteComment', () => {
    const commentId = 55;
    const userId = 10;

    const mockComment = {
      id: commentId,
      message: 'Test comment',
      sender: { id: userId, username: 'alice' } as User,
    } as Comment;

    it('should delete comment when it exists and user is the owner', async () => {
      mockCommentRepository.findOne.mockResolvedValue(mockComment);
      mockCommentRepository.delete.mockResolvedValue({ affected: 1 });

      await commentService.deleteComment(commentId, userId);

      expect(mockCommentRepository.findOne).toHaveBeenCalledWith({
        where: { id: commentId },
        relations: { sender: true },
      });

      expect(mockCommentRepository.delete).toHaveBeenCalledWith(commentId);
    });

    it('should throw NotFoundException when comment does not exist', async () => {
      mockCommentRepository.findOne.mockResolvedValue(null);

      await expect(
        commentService.deleteComment(commentId, userId),
      ).rejects.toThrow(NotFoundException);

      expect(mockCommentRepository.delete).not.toHaveBeenCalled();
    });

    it('should throw ForbiddenException when user is not the owner', async () => {
      const wrongUserComment = {
        ...mockComment,
        sender: { id: 999 } as User,
      };

      mockCommentRepository.findOne.mockResolvedValue(wrongUserComment);

      await expect(
        commentService.deleteComment(commentId, userId),
      ).rejects.toThrow(ForbiddenException);

      expect(mockCommentRepository.delete).not.toHaveBeenCalled();
    });
  });
});
