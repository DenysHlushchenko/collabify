/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { VoteService } from './vote.service';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { Post } from 'src/modules/post/entities/post.entity';
import { Comment } from 'src/modules/comment/entities/comment.entity';
import { PostVote } from 'src/modules/post/entities/post_vote.entity';
import { CommentVote } from 'src/modules/comment/entities/comment_vote.entity';
import { VoteType } from '../enums/enums';
import { NotFoundException } from '@nestjs/common';

describe('VoteService', () => {
  let service: VoteService;
  let mockDataSource: Partial<DataSource>;
  let mockQueryRunner: jest.Mocked<QueryRunner>;
  let mockPostRepository: Partial<jest.Mocked<Repository<Post>>> & {
    findOne: jest.Mock;
  };

  let mockCommentRepository: Partial<jest.Mocked<Repository<Comment>>> & {
    findOne: jest.Mock;
  };

  let mockPostVoteRepository: Partial<jest.Mocked<Repository<PostVote>>> & {
    findOne: jest.Mock;
  };

  let mockCommentVoteRepository: Partial<
    jest.Mocked<Repository<CommentVote>>
  > & {
    findOne: jest.Mock;
  };

  beforeEach(async () => {
    mockPostRepository = {
      findOne: jest.fn(),
    };

    mockCommentRepository = {
      findOne: jest.fn(),
    };

    mockPostVoteRepository = {
      findOne: jest.fn(),
    };

    mockCommentVoteRepository = {
      findOne: jest.fn(),
    };

    const mockManager = {
      findOneOrFail: jest.fn(),
      findOne: jest.fn(),
      increment: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
    };

    mockQueryRunner = {
      connect: jest.fn(),
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
      release: jest.fn(),
      manager: mockManager,
    } as unknown as jest.Mocked<QueryRunner>;

    mockDataSource = {
      createQueryRunner: jest.fn().mockReturnValue(mockQueryRunner),
      getRepository: jest.fn().mockImplementation((entity: any) => {
        if (entity === Post) return mockPostRepository;
        if (entity === Comment) return mockCommentRepository;
        if (entity === PostVote) return mockPostVoteRepository;
        if (entity === CommentVote) return mockCommentVoteRepository;
      }),
    } as unknown as DataSource;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VoteService,
        { provide: DataSource, useValue: mockDataSource },
      ],
    }).compile();

    service = module.get<VoteService>(VoteService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findVoteByEntity', () => {
    const postId = 15;
    const commentId = 88;
    const userId = 7;

    describe('for Posts', () => {
      it('should return counts + null user vote when no userId provided', async () => {
        mockPostRepository.findOne.mockResolvedValue({
          upvotesCount: 42,
          downvotesCount: 3,
        } as Post);

        const result = await service.findVoteByEntity(
          mockPostRepository as Repository<Post>,
          postId,
        );

        expect(result).toEqual({
          userVote: null,
          votesCounts: { upvotesCount: 42, downvotesCount: 3 },
        });
        expect(mockPostVoteRepository.findOne).not.toHaveBeenCalled();
      });

      it('should return existing LIKE vote + counts', async () => {
        mockPostRepository.findOne.mockResolvedValue({
          upvotesCount: 19,
          downvotesCount: 2,
        } as Post);
        mockPostVoteRepository.findOne.mockResolvedValue({
          type: VoteType.LIKE,
        } as PostVote);

        const result = await service.findVoteByEntity(
          mockPostRepository as Repository<Post>,
          postId,
          userId,
        );

        expect(result).toEqual({
          userVote: null,
          votesCounts: { upvotesCount: 19, downvotesCount: 2 },
        });
      });

      it('should return null userVote when user has not voted', async () => {
        mockPostRepository.findOne.mockResolvedValue({
          upvotesCount: 5,
          downvotesCount: 0,
        } as Post);
        mockPostVoteRepository.findOne.mockResolvedValue(null);

        const result = await service.findVoteByEntity(
          mockPostRepository as Repository<Post>,
          postId,
          userId,
        );

        expect(result.userVote).toBeNull();
      });

      it('should throw NotFoundException when post does not exist', async () => {
        mockPostRepository.findOne.mockResolvedValue(null);

        await expect(
          service.findVoteByEntity(
            mockPostRepository as Repository<Post>,
            postId,
            userId,
          ),
        ).rejects.toThrow(NotFoundException);
      });
    });

    describe('for Comments', () => {
      it('should return counts + DISLIKE user vote', async () => {
        mockCommentRepository.findOne.mockResolvedValue({
          upvotesCount: 8,
          downvotesCount: 14,
        } as Comment);
        mockCommentVoteRepository.findOne.mockResolvedValue({
          type: VoteType.DISLIKE,
        } as CommentVote);

        const result = await service.findVoteByEntity(
          mockCommentRepository as Repository<Comment>,
          commentId,
          userId,
        );

        expect(result).toEqual({
          userVote: VoteType.DISLIKE,
          votesCounts: { upvotesCount: 8, downvotesCount: 14 },
        });
      });
    });
  });

  describe('sendVote', () => {
    const userId = 7;
    const postId = 15;
    const commentId = 82;

    describe('Posts', () => {
      beforeEach(() => {
        (mockQueryRunner.manager.findOneOrFail as jest.Mock).mockResolvedValue({
          id: postId,
          upvotesCount: 10,
          downvotesCount: 2,
        } as Post);
      });

      it('should add new LIKE when no previous vote', async () => {
        (mockQueryRunner.manager.findOne as jest.Mock).mockResolvedValue(null);

        await service.sendVote(userId, postId, Post, { type: VoteType.LIKE });

        expect(mockQueryRunner.manager.increment).toHaveBeenCalledWith(
          Post,
          { id: postId },
          'upvotesCount',
          1,
        );
        expect(mockQueryRunner.manager.save).toHaveBeenCalledWith(
          PostVote,
          expect.objectContaining({
            post: { id: postId },
            user: { id: userId },
            type: VoteType.LIKE,
          }),
        );
        expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
      });

      it('should remove existing LIKE when same type clicked again', async () => {
        const existing = { id: 300, type: VoteType.LIKE };

        (mockQueryRunner.manager.findOne as jest.Mock).mockResolvedValue(
          existing,
        );

        await service.sendVote(userId, postId, Post, { type: VoteType.LIKE });

        expect(mockQueryRunner.manager.increment).toHaveBeenCalledWith(
          Post,
          { id: postId },
          'upvotesCount',
          -1,
        );
        expect(mockQueryRunner.manager.remove).toHaveBeenCalledWith(existing);
        expect(mockQueryRunner.manager.save).not.toHaveBeenCalled();
      });

      it('should switch from LIKE → DISLIKE', async () => {
        (mockQueryRunner.manager.findOne as jest.Mock).mockResolvedValue({
          id: 301,
          type: VoteType.LIKE,
        });

        await service.sendVote(userId, postId, Post, {
          type: VoteType.DISLIKE,
        });

        expect(mockQueryRunner.manager.increment).toHaveBeenNthCalledWith(
          1,
          Post,
          { id: postId },
          'upvotesCount',
          -1,
        );
        expect(mockQueryRunner.manager.increment).toHaveBeenNthCalledWith(
          2,
          Post,
          { id: postId },
          'downvotesCount',
          1,
        );
        expect(mockQueryRunner.manager.save).toHaveBeenCalledWith(
          expect.objectContaining({ type: VoteType.DISLIKE }),
        );
      });

      it('should remove vote when type = null (neutral)', async () => {
        const existing = { id: 302, type: VoteType.DISLIKE };

        (mockQueryRunner.manager.findOne as jest.Mock).mockResolvedValue(
          existing,
        );

        await service.sendVote(userId, postId, Post, { type: null });

        expect(mockQueryRunner.manager.increment).toHaveBeenCalledWith(
          Post,
          { id: postId },
          'downvotesCount',
          -1,
        );
        expect(mockQueryRunner.manager.remove).toHaveBeenCalledWith(existing);
        expect(mockQueryRunner.manager.save).not.toHaveBeenCalled();
      });

      it('should rollback transaction when error occurs', async () => {
        (
          mockQueryRunner.manager.findOneOrFail as jest.Mock
        ).mockRejectedValueOnce(new Error('Database connection lost'));

        await expect(
          service.sendVote(userId, postId, Post, { type: VoteType.LIKE }),
        ).rejects.toThrow();

        expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
        expect(mockQueryRunner.commitTransaction).not.toHaveBeenCalled();
      });
    });

    describe('Comments', () => {
      it('should add new DISLIKE to comment', async () => {
        (mockQueryRunner.manager.findOneOrFail as jest.Mock).mockResolvedValue({
          id: commentId,
        });
        (mockQueryRunner.manager.findOne as jest.Mock).mockResolvedValue(null);

        await service.sendVote(userId, commentId, Comment, {
          type: VoteType.DISLIKE,
        });

        expect(mockQueryRunner.manager.increment).toHaveBeenCalledWith(
          Comment,
          { id: commentId },
          'downvotesCount',
          1,
        );
        expect(mockQueryRunner.manager.save).toHaveBeenCalledWith(
          CommentVote,
          expect.objectContaining({
            comment: { id: commentId },
            user: { id: userId },
            type: VoteType.DISLIKE,
          }),
        );
      });
    });
  });
});
