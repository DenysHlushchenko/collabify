import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { CreateCommentDto } from './dtos/CreateComment.dto';
import { PostService } from '../post/post.service';
import { VoteResponse } from 'src/shared/types';
import { CreateCommentVoteDto } from './dtos/CreateCommentVote.dto';
import { VoteService } from 'src/shared/vote/vote.service';
import { Voteable } from 'src/shared/vote/vote.interface';

@Injectable()
export class CommentService implements Voteable {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    private readonly userService: UserService,
    private readonly voteService: VoteService,

    @Inject(forwardRef(() => PostService))
    private readonly postService: PostService,
  ) {}

  async create(
    createCommentDto: CreateCommentDto,
    postId: number,
  ): Promise<void> {
    const { content, senderId } = createCommentDto;
    const existingUser = await this.userService.findById(senderId);

    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    const post = await this.postService.getPostById(postId);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const comment = this.commentRepository.create({
      message: content,
      post,
      sender: existingUser,
      created_at: new Date(),
    });
    await this.commentRepository.save(comment);
  }

  async getAllCommentsByPostId(postId: number): Promise<Comment[]> {
    const post = await this.postService.getPostById(postId);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return await this.commentRepository.find({
      where: { post: { id: postId } },
      relations: {
        sender: true,
      },
      order: {
        created_at: 'DESC',
      },
    });
  }

  async deleteComment(commentId: number, userId: number): Promise<void> {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
      relations: {
        sender: true,
      },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.sender.id !== userId) {
      throw new ForbiddenException('You can only delete your own comments');
    }

    await this.commentRepository.delete(commentId);
  }

  async getVote(commentId: number, userId?: number): Promise<VoteResponse> {
    return this.voteService.findVoteByEntity(
      this.commentRepository,
      commentId,
      userId,
    );
  }

  async sendVote(
    commentId: number,
    userId: number,
    createCommentVoteDto: CreateCommentVoteDto,
  ): Promise<void> {
    return await this.voteService.sendVote(
      userId,
      commentId,
      Comment,
      createCommentVoteDto,
    );
  }
}
