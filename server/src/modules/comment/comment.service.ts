import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { CreateCommentDto } from './dtos/CreateComment.dto';
import { PostService } from '../post/post.service';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    private readonly userService: UserService,
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
}
