import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dtos/CreatePost.dto';
import { AuthGuard } from 'src/user/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  async createPost(@Body() createPostDto: CreatePostDto): Promise<void> {
    return await this.postService.create(createPostDto);
  }
}
