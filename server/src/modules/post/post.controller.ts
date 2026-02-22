import {
  Body,
  Controller,
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
  async getAllPostsByUserId(@Param('userId', ParseIntPipe) userId: number) {
    return await this.postService.getAllPostsByUserId(userId);
  }

  @Put(':id')
  async updatePost(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<void> {
    return await this.postService.updatePost(id, updatePostDto);
  }
}
