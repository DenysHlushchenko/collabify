import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { PostService } from './post.service';
import { CreatePostDto } from './dtos/CreatePost.dto';
import { AuthGuard } from 'src/modules/user/auth/auth.guard';
import { UpdatePostDto } from './dtos/UpdatePost.dto';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { User } from '../user/entities/user.entity';
import { CreatePostVoteDto } from './dtos/CreatePostVote.dto';
import { VoteResponse } from 'src/shared/types';

@ApiTags('posts')
@UseGuards(AuthGuard)
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new post' })
  @ApiBody({ type: CreatePostDto })
  @ApiResponse({ status: 201, description: 'Post created successfully' })
  async createPost(@Body() createPostDto: CreatePostDto): Promise<void> {
    return await this.postService.create(createPostDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all posts' })
  @ApiQuery({ name: 'search', type: 'string', required: false })
  @ApiQuery({ name: 'filter', enum: ['ASC', 'DESC'], required: false })
  @ApiResponse({
    status: 200,
    description: 'List of posts',
    example: [
      {
        id: 1,
        title: 'Looking for React developers',
        description: 'Need experienced React developers for a startup project',
        group_size: 3,
        upvotesCount: 10,
        downvotesCount: 2,
        created_at: '2024-03-20T10:30:00Z',
        updated_at: '2024-03-25T14:22:00Z',
        user: {
          id: 1,
          username: 'johndoe',
          reputation: 4.5,
        },
        postTags: [
          { postId: 1, tagId: 1, tag: { id: 1, name: 'React' } },
          { postId: 1, tagId: 2, tag: { id: 2, name: 'JavaScript' } },
        ],
      },
    ],
  })
  async getAllPosts(
    @Query('search') search?: string,
    @Query('filter') filter?: 'ASC' | 'DESC',
  ) {
    return await this.postService.getAll({ search, sort: filter });
  }

  @Get('/users/:userId')
  @ApiOperation({ summary: 'Get all posts by a user' })
  @ApiParam({
    name: 'userId',
    description: 'The ID of the user',
    type: 'number',
  })
  @ApiQuery({ name: 'search', type: 'string', required: false })
  @ApiQuery({ name: 'filter', enum: ['ASC', 'DESC'], required: false })
  @ApiResponse({
    status: 200,
    description: 'List of user posts',
    example: [
      {
        id: 1,
        title: 'Looking for React developers',
        description: 'Need experienced React developers for a startup project',
        group_size: 3,
        upvotesCount: 10,
        downvotesCount: 2,
        created_at: '2024-03-20T10:30:00Z',
        updated_at: '2024-03-25T14:22:00Z',
        user: {
          id: 1,
          username: 'johndoe',
          reputation: 4.5,
        },
        postTags: [{ postId: 1, tagId: 1, tag: { id: 1, name: 'React' } }],
      },
    ],
  })
  async getAllPostsByUserId(
    @Param('userId', ParseIntPipe) userId: number,
    @Query('search') search?: string,
    @Query('filter') filter?: 'ASC' | 'DESC',
  ) {
    return await this.postService.getAllPostsByUserId(
      { search, sort: filter },
      userId,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a post by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the post', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'The post details',
    example: {
      id: 1,
      title: 'Looking for React developers',
      description: 'Need experienced React developers for a startup project',
      group_size: 3,
      upvotesCount: 10,
      downvotesCount: 2,
      created_at: '2024-03-20T10:30:00Z',
      updated_at: '2024-03-25T14:22:00Z',
      user: {
        id: 1,
        username: 'johndoe',
        reputation: 4.5,
        bio: 'Passionate about web development',
      },
      postTags: [
        { postId: 1, tagId: 1, tag: { id: 1, name: 'React' } },
        { postId: 1, tagId: 2, tag: { id: 2, name: 'JavaScript' } },
        { postId: 1, tagId: 3, tag: { id: 3, name: 'Startup' } },
      ],
      comments: [
        {
          id: 1,
          message: 'I am interested!',
          upvotesCount: 2,
          downvotesCount: 0,
          created_at: '2024-03-22T08:15:00Z',
          sender: { id: 2, username: 'janedoe' },
        },
      ],
      chats: [
        {
          id: 1,
          title: 'React Dev Team',
          max_members: 3,
          created_at: '2024-03-20T10:30:00Z',
        },
      ],
    },
  })
  async getPostById(@Param('id', ParseIntPipe) id: number) {
    return await this.postService.getPostById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a post' })
  @ApiParam({ name: 'id', description: 'The ID of the post', type: 'number' })
  @ApiBody({ type: UpdatePostDto })
  @ApiResponse({ status: 200, description: 'Post updated successfully' })
  async updatePost(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostDto: UpdatePostDto,
    @CurrentUser() user: User,
  ): Promise<void> {
    return await this.postService.updatePost(id, updatePostDto, user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a post' })
  @ApiParam({ name: 'id', description: 'The ID of the post', type: 'number' })
  @ApiResponse({ status: 204, description: 'Post deleted successfully' })
  async deletePost(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ): Promise<void> {
    return await this.postService.deletePost(id, user.id);
  }

  @Get(':id/votes')
  @ApiOperation({ summary: 'Get vote status for a post' })
  @ApiParam({ name: 'id', description: 'The ID of the post', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'Vote response',
    example: {
      type: 'like',
      upvotesCount: 10,
      downvotesCount: 2,
    },
  })
  async getPostVote(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ): Promise<VoteResponse> {
    return await this.postService.getVote(id, user.id);
  }

  @Post(':id/votes')
  @ApiOperation({ summary: 'Send a vote on a post' })
  @ApiParam({ name: 'id', description: 'The ID of the post', type: 'number' })
  @ApiBody({ type: CreatePostVoteDto })
  @ApiResponse({ status: 201, description: 'Vote recorded' })
  async sendPostVote(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
    @Body() createPostVoteDto: CreatePostVoteDto,
  ): Promise<void> {
    return await this.postService.sendVote(id, user.id, createPostVoteDto);
  }
}
