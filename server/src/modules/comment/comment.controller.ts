import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../user/auth/auth.guard';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dtos/CreateComment.dto';
import { Comment } from './entities/comment.entity';
import { User } from '../user/entities/user.entity';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';

@UseGuards(AuthGuard)
@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('posts/:postId')
  async createComment(
    @Param('postId', ParseIntPipe) postId: number,
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<void> {
    await this.commentService.create(createCommentDto, postId);
  }

  @Get('/posts/:postId')
  async getAllCommentsByPostId(
    @Param('postId', ParseIntPipe) postId: number,
  ): Promise<Comment[]> {
    return await this.commentService.getAllCommentsByPostId(postId);
  }

  @Delete('/:commentId')
  async deleteComment(
    @Param('commentId', ParseIntPipe) commentId: number,
    @CurrentUser() user: User,
  ): Promise<void> {
    await this.commentService.deleteComment(commentId, user.id);
  }
}
