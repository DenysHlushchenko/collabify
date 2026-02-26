/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
import { Injectable, NotFoundException } from '@nestjs/common';
import { VoteResponse } from '../types';
import { Post } from 'src/modules/post/entities/post.entity';
import { Comment } from 'src/modules/comment/entities/comment.entity';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { PostVote } from 'src/modules/post/entities/post_vote.entity';
import { CommentVote } from 'src/modules/comment/entities/comment_vote.entity';
import { CreateVoteDto } from './dtos/CreateVote.dto';
import { VoteType } from '../enums/enums';

@Injectable()
export class VoteService {
  constructor(private readonly dataSource: DataSource) {}

  async findVoteByEntity(
    entityRepository: Repository<Post>,
    entityId: number,
    userId?: number,
  ): Promise<VoteResponse>;

  async findVoteByEntity(
    entityRepository: Repository<Comment>,
    entityId: number,
    userId?: number,
  ): Promise<VoteResponse>;

  /**
   *
   * @param entityRepository
   * @param entityId
   * @param userId
   * @returns
   */
  async findVoteByEntity(
    entityRepository: Repository<Post> | Repository<Comment>,
    entityId: number,
    userId?: number,
  ): Promise<VoteResponse> {
    if (!entityId) {
      throw new NotFoundException('Entity must have an ID');
    }

    const voteCounts = await entityRepository.findOneOrFail({
      where: {
        id: entityId,
      },
      select: ['upvotesCount', 'downvotesCount'],
    });

    let userVote: 'like' | 'dislike' | null = null;

    if (userId) {
      const isPost = entityRepository.target === Post;

      const voteRepository = isPost
        ? this.dataSource.getRepository(PostVote)
        : this.dataSource.getRepository(CommentVote);

      const relationField = isPost ? 'post' : 'comment';

      const vote = await voteRepository.findOne({
        where: {
          [relationField]: { id: entityId },
          user: { id: userId },
        },
      });

      userVote = vote?.type ?? null;
    }

    return {
      userVote,
      votesCounts: {
        upvotesCount: voteCounts.upvotesCount || 0,
        downvotesCount: voteCounts.downvotesCount || 0,
      },
    };
  }

  private async updateLike(
    entityId: number,
    entityType: typeof Post | typeof Comment,
    qr: QueryRunner,
    delta: number,
  ) {
    await qr.manager.increment(
      entityType,
      { id: entityId },
      'upvotesCount',
      delta,
    );
  }

  private async updateDislike(
    entityId: number,
    entityType: typeof Post | typeof Comment,
    qr: QueryRunner,
    delta: number,
  ) {
    await qr.manager.increment(
      entityType,
      { id: entityId },
      'downvotesCount',
      delta,
    );
  }

  async sendVote(
    userId: number,
    entityId: number,
    entityType: typeof Post,
    createVoteDto: CreateVoteDto,
  ): Promise<void>;

  async sendVote(
    userId: number,
    entityId: number,
    entityType: typeof Comment,
    createVoteDto: CreateVoteDto,
  ): Promise<void>;

  /**
   * Handles atomicly like/dislike/no-action on a post/comment for a given user
   * It supports a new vote addition (like or dislike), existing vote toggle, and switch between votes.
   * @param userId
   * @param commentId
   * @param createVoteDto
   */
  async sendVote(
    userId: number,
    entityId: number,
    entityType: typeof Post | typeof Comment,
    createVoteDto: CreateVoteDto,
  ): Promise<void> {
    // a QueryRunner helps prevent data inconsistencies by either commiting all actions or rolling back if process fails
    // for instance: the addition of a like/dislike succeeds but vote record insertion might fail, leading to incorrect vote counter data.
    const qr = this.dataSource.createQueryRunner();

    try {
      await qr.connect();
      await qr.startTransaction();

      const { type } = createVoteDto;
      const entity = await qr.manager.findOneOrFail(entityType, {
        where: {
          id: entityId,
        },
      });

      const isPost = entityType === Post;
      const VoteEntity = isPost ? PostVote : CommentVote;
      const relationField = isPost ? 'post' : 'comment';

      const existingVote = await qr.manager.findOne(VoteEntity, {
        where: {
          user: { id: userId },
          [relationField]: { id: entity.id },
        },
      });

      if (existingVote) {
        // toggle off (either like or dislike button)
        if (type === null || existingVote.type === type) {
          if (existingVote.type === VoteType.LIKE) {
            await this.updateLike(entityId, entityType, qr, -1);
          } else if (existingVote.type === VoteType.DISLIKE) {
            await this.updateDislike(entityId, entityType, qr, -1);
          }
          await qr.manager.remove(existingVote);
        }
        // switch type
        else {
          if (existingVote.type === VoteType.LIKE) {
            await this.updateLike(entityId, entityType, qr, -1);
            await this.updateDislike(entityId, entityType, qr, 1);
          } else {
            await this.updateDislike(entityId, entityType, qr, -1);
            await this.updateLike(entityId, entityType, qr, 1);
          }

          existingVote.type = type as VoteType;
          await qr.manager.save(existingVote);
        }
      } else {
        // new vote
        if (type === VoteType.LIKE) {
          await this.updateLike(entityId, entityType, qr, 1);
        } else if (type === VoteType.DISLIKE) {
          await this.updateDislike(entityId, entityType, qr, 1);
        }

        if (type !== null) {
          await qr.manager.save(VoteEntity, {
            [relationField]: { id: entityId },
            user: { id: userId },
            type: type as VoteType,
          });
        }
      }
      await qr.commitTransaction();
    } catch (error) {
      await qr.rollbackTransaction();
      throw error;
    } finally {
      await qr.release();
    }
  }
}
