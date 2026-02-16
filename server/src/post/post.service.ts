import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dtos/CreatePost.dto';
import { UserService } from 'src/user/user.service';
import { UserDoesNotExistException } from 'src/shared/exceptions/UserDoesNotExist.exception';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    private readonly userService: UserService,
  ) {}

  async create(createPostDto: CreatePostDto): Promise<void> {
    const { title, description, groupSize, userId } = createPostDto;

    const currentUser = await this.userService.findById(userId);
    if (!currentUser) {
      throw new UserDoesNotExistException();
    }

    await this.postRepository.save(
      this.postRepository.create({
        title,
        description,
        group_size: groupSize,
        created_at: new Date(),
        updated_at: new Date(),
        user: { id: userId },
      }),
    );
  }
}
