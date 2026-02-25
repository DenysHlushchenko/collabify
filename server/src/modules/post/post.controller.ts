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
import { PostService } from './post.service';
import { CreatePostDto } from './dtos/CreatePost.dto';
import { AuthGuard } from 'src/modules/user/auth/auth.guard';
import { UpdatePostDto } from './dtos/UpdatePost.dto';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { User } from '../user/entities/user.entity';
import { CreatePostVoteDto } from './dtos/CreatePostVote.dto';

@UseGuards(AuthGuard)
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  async createPost(@Body() createPostDto: CreatePostDto): Promise<void> {
    return await this.postService.create(createPostDto);
  }

  @Get()
  async getAllPosts(
    @Query('search') search?: string,
    @Query('filter') filter?: 'ASC' | 'DESC',
  ) {
    return await this.postService.getAll({ search, sort: filter });
  }

  @Get('/users/:userId')
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
  async getPostById(@Param('id', ParseIntPipe) id: number) {
    return await this.postService.getPostById(id);
  }

  @Put(':id')
  async updatePost(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostDto: UpdatePostDto,
    @CurrentUser() user: User,
  ): Promise<void> {
    return await this.postService.updatePost(id, updatePostDto, user.id);
  }

  @Delete(':id')
  async deletePost(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ): Promise<void> {
    return await this.postService.deletePost(id, user.id);
  }

  @Post(':id/votes')
  async sendPostVote(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
    @Body() createPostVoteDto: CreatePostVoteDto,
  ) {
    return await this.postService.sendPostVote(id, user, createPostVoteDto);
  }
}
