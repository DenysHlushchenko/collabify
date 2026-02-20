import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dtos/CreatePost.dto';
import { UserService } from 'src/modules/user/user.service';
import { UserDoesNotExistException } from 'src/shared/exceptions/UserDoesNotExist.exception';
import { TagService } from '../tag/tag.service';
import { PostTag } from '../tag/entities/post_tag.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    private readonly userService: UserService,
    private readonly tagService: TagService,
  ) {}

  /**
   * Creates new user's post. If a user by given ID does not exist, an error is thrown, indicating that user was not found.
   * @param createPostDto (title, description, groupSize, tags, userId).
   * @throws UserDoesNotExistException
   */
  async create(createPostDto: CreatePostDto): Promise<void> {
    const {
      title,
      description,
      groupSize,
      tags: tagNames,
      userId,
    } = createPostDto;

    const currentUser = await this.userService.findById(userId);
    if (!currentUser) {
      throw new UserDoesNotExistException();
    }

    const post = this.postRepository.create({
      title,
      description,
      group_size: groupSize,
      user: currentUser,
      created_at: new Date(),
      updated_at: new Date(),
    });

    const savedPost = await this.postRepository.save(post);

    if (tagNames) {
      const tags = await this.tagService.findOrCreateMany(tagNames);
      const postTagRepo = this.postRepository.manager.getRepository(PostTag);
      const postTags = tags.map((tag) =>
        postTagRepo.create({ postId: savedPost.id, tagId: tag.id }),
      );
      await postTagRepo.save(postTags);
    }
  }

  /**
   * Retrieves all posts from the database.
   * @returns An array of Post entities representing all posts in the database.
   */
  async getAll(): Promise<Post[]> {
    return this.postRepository.find({
      relations: {
        user: true,
        postTags: {
          tag: true,
        },
        comments: true,
      },
      select: {
        user: {
          id: true,
          username: true,
          gender: true,
          reputation: true,
          email: true,
          created_at: true,
          updated_at: true,
        },
      },
    });
  }
}
