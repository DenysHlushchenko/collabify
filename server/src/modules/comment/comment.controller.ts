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
import { VoteResponse } from 'src/shared/types';
import { CreateCommentVoteDto } from './dtos/CreateCommentVote.dto';

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

  @Get(':id/votes')
  async getCommentVote(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ): Promise<VoteResponse> {
    return await this.commentService.getVote(id, user.id);
  }

  @Post(':id/votes')
  async sendCommentVote(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
    @Body() createCommentVoteDto: CreateCommentVoteDto,
  ): Promise<void> {
    return await this.commentService.sendVote(
      id,
      user.id,
      createCommentVoteDto,
    );
  }
}
