/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
import { Injectable } from '@nestjs/common';
import { PostVote } from '../entities/post_vote.entity';
import { DataSource, QueryRunner } from 'typeorm';
import { Post } from '../entities/post.entity';
import { CreatePostVoteDto } from '../dtos/CreatePostVote.dto';
import { VoteType } from 'src/shared/enums/enums';
import { VoteResponse } from 'src/shared/types';

@Injectable()
export class PostVoteService {
  constructor(private readonly dataSource: DataSource) {}

  private async getPostByIdWithQueryRunner(
    postId: number,
    queryRunner: QueryRunner,
  ): Promise<Post> {
    return await queryRunner.manager.findOneOrFail(Post, {
      where: {
        id: postId,
      },
    });
  }

  private async getPostVote(
    userId: number,
    postId: number,
    queryRunner: QueryRunner,
  ): Promise<PostVote | null> {
    return await queryRunner.manager.findOne(PostVote, {
      where: {
        user: { id: userId },
        post: { id: postId },
      },
    });
  }

  private async incrementLike(postId: number, qr: QueryRunner) {
    await qr.manager.increment(Post, { id: postId }, 'upvotesCount', 1);
  }

  private async decrementLike(postId: number, qr: QueryRunner) {
    await qr.manager.decrement(Post, { id: postId }, 'upvotesCount', 1);
  }

  private async incrementDislike(postId: number, qr: QueryRunner) {
    await qr.manager.increment(Post, { id: postId }, 'downvotesCount', 1);
  }

  private async decrementDislike(postId: number, qr: QueryRunner) {
    await qr.manager.decrement(Post, { id: postId }, 'downvotesCount', 1);
  }

  /**
   * Handles concurrently like/dislike/no-action on a post for a given user.
   * It supports a new vote addition (like or dislike), existing vote toggle, and switch between votes.
   * @param userId
   * @param postId
   * @param createPostVoteDto
   * @returns User vote, upvotes and downvotes counts in JSON format.
   */
  async sendVote(
    userId: number,
    postId: number,
    createPostVoteDto: CreatePostVoteDto,
  ): Promise<VoteResponse> {
    const qr = this.dataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();
    try {
      const { type } = createPostVoteDto;
      const post = await this.getPostByIdWithQueryRunner(postId, qr);
      const existingPostVote = await this.getPostVote(userId, post.id, qr);

      if (existingPostVote) {
        // toggle off (either like or dislike button)
        if (type === null || existingPostVote.type === type) {
          if (existingPostVote.type === VoteType.LIKE) {
            await this.decrementLike(postId, qr);
          } else if (existingPostVote.type === VoteType.DISLIKE) {
            await this.decrementDislike(postId, qr);
          }
          await qr.manager.remove(existingPostVote);
        }
        // switch type
        else {
          if (existingPostVote.type === VoteType.LIKE) {
            await this.decrementLike(postId, qr);
            await this.incrementDislike(postId, qr);
          } else {
            await this.decrementDislike(postId, qr);
            await this.incrementLike(postId, qr);
          }

          existingPostVote.type = type as VoteType;
          await qr.manager.save(existingPostVote);
        }
      } else {
        // new vote
        if (type === VoteType.LIKE) {
          await this.incrementLike(postId, qr);
        } else if (type === VoteType.DISLIKE) {
          await this.incrementDislike(postId, qr);
        }

        if (type !== null) {
          await qr.manager.save(PostVote, {
            post: { id: postId },
            user: { id: userId },
            type: type as VoteType,
          });
        }
      }
      await qr.commitTransaction();
      const updatedPost = await this.getPostByIdWithQueryRunner(postId, qr);
      const currentVote = await this.getPostVote(userId, post.id, qr);

      return {
        userVote: currentVote?.type ?? null,
        votesCounts: {
          upvotesCount: updatedPost.upvotesCount,
          downvotesCount: updatedPost.downvotesCount,
        },
      };
    } catch (error) {
      await qr.rollbackTransaction();
      throw error;
    } finally {
      await qr.release();
    }
  }
}
