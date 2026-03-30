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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { AuthGuard } from '../user/auth/auth.guard';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dtos/CreateComment.dto';
import { Comment } from './entities/comment.entity';
import { User } from '../user/entities/user.entity';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { VoteResponse } from 'src/shared/types';
import { CreateCommentVoteDto } from './dtos/CreateCommentVote.dto';

@ApiTags('comments')
@UseGuards(AuthGuard)
@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('posts/:postId')
  @ApiOperation({ summary: 'Create a comment on a post' })
  @ApiParam({
    name: 'postId',
    description: 'The ID of the post',
    type: 'number',
  })
  @ApiBody({ type: CreateCommentDto })
  @ApiResponse({ status: 201, description: 'Comment created successfully' })
  async createComment(
    @Param('postId', ParseIntPipe) postId: number,
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<void> {
    await this.commentService.create(createCommentDto, postId);
  }

  @Get('/posts/:postId')
  @ApiOperation({ summary: 'Get all comments for a post' })
  @ApiParam({
    name: 'postId',
    description: 'The ID of the post',
    type: 'number',
  })
  @ApiResponse({
    status: 200,
    description: 'List of comments',
    example: [
      {
        id: 1,
        message: 'This is a great post!',
        upvotesCount: 5,
        downvotesCount: 1,
        created_at: '2024-03-22T08:15:00Z',
        updated_at: '2024-03-23T10:30:00Z',
        sender: {
          id: 2,
          username: 'janedoe',
          reputation: 3.8,
        },
        post: { id: 1 },
      },
      {
        id: 2,
        message: 'I am interested in joining!',
        upvotesCount: 3,
        downvotesCount: 0,
        created_at: '2024-03-23T09:45:00Z',
        updated_at: '2024-03-23T09:45:00Z',
        sender: {
          id: 3,
          username: 'johndoe2',
          reputation: 4.2,
        },
        post: { id: 1 },
      },
    ],
  })
  async getAllCommentsByPostId(
    @Param('postId', ParseIntPipe) postId: number,
  ): Promise<Comment[]> {
    return await this.commentService.getAllCommentsByPostId(postId);
  }

  @Delete('/:commentId')
  @ApiOperation({ summary: 'Delete a comment' })
  @ApiParam({
    name: 'commentId',
    description: 'The ID of the comment',
    type: 'number',
  })
  @ApiResponse({ status: 204, description: 'Comment deleted successfully' })
  async deleteComment(
    @Param('commentId', ParseIntPipe) commentId: number,
    @CurrentUser() user: User,
  ): Promise<void> {
    await this.commentService.deleteComment(commentId, user.id);
  }

  @Get(':id/votes')
  @ApiOperation({ summary: 'Get vote status for a comment' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the comment',
    type: 'number',
  })
  @ApiResponse({
    status: 200,
    description: 'Vote response',
    example: {
      type: 'like',
      upvotesCount: 5,
      downvotesCount: 1,
    },
  })
  async getCommentVote(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ): Promise<VoteResponse> {
    return await this.commentService.getVote(id, user.id);
  }

  @Post(':id/votes')
  @ApiOperation({ summary: 'Send a vote on a comment' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the comment',
    type: 'number',
  })
  @ApiBody({ type: CreateCommentVoteDto })
  @ApiResponse({ status: 201, description: 'Vote recorded' })
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
