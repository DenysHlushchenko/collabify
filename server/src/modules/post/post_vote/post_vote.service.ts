/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
import { Injectable } from '@nestjs/common';
import { PostVote } from '../entities/post_vote.entity';
import { DataSource, QueryRunner } from 'typeorm';
import { Post } from '../entities/post.entity';
import { CreatePostVoteDto } from '../dtos/CreatePostVote.dto';
import { VoteType } from 'src/shared/enums/enums';

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

  private async updateLike(postId: number, qr: QueryRunner, delta: number) {
    await qr.manager.increment(Post, { id: postId }, 'upvotesCount', delta);
  }

  private async updateDislike(postId: number, qr: QueryRunner, delta: number) {
    await qr.manager.increment(Post, { id: postId }, 'downvotesCount', delta);
  }

  /**
   * Handles atomicly like/dislike/no-action on a post for a given user
   * It supports a new vote addition (like or dislike), existing vote toggle, and switch between votes.
   * @param userId
   * @param postId
   * @param createPostVoteDto
   */
  async sendVote(
    userId: number,
    postId: number,
    createPostVoteDto: CreatePostVoteDto,
  ): Promise<void> {
    // a QueryRunner helps prevent data inconsistencies by either commiting all actions or rolling back if process fails
    // for instance: the addition of a like/dislike succeeds but vote record insertion might fail, leading to incorrect vote counter data.
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
            await this.updateLike(postId, qr, -1);
          } else if (existingPostVote.type === VoteType.DISLIKE) {
            await this.updateDislike(postId, qr, -1);
          }
          await qr.manager.remove(existingPostVote);
        }
        // switch type
        else {
          if (existingPostVote.type === VoteType.LIKE) {
            await this.updateLike(postId, qr, -1);
            await this.updateDislike(postId, qr, 1);
          } else {
            await this.updateDislike(postId, qr, -1);
            await this.updateLike(postId, qr, 1);
          }

          existingPostVote.type = type as VoteType;
          await qr.manager.save(existingPostVote);
        }
      } else {
        // new vote
        if (type === VoteType.LIKE) {
          await this.updateLike(postId, qr, 1);
        } else if (type === VoteType.DISLIKE) {
          await this.updateDislike(postId, qr, 1);
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
    } catch (error) {
      await qr.rollbackTransaction();
      throw error;
    } finally {
      await qr.release();
    }
  }
}
