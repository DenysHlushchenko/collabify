import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dtos/CreatePost.dto';
import { UserService } from 'src/modules/user/user.service';
import { UserDoesNotExistException } from 'src/shared/exceptions/UserDoesNotExist.exception';
import { ChatService } from '../chat/chat.service';
import { Chat } from '../chat/entities/chat.entity';
import { TagService } from '../tag/tag.service';
import { PostTag } from '../tag/entities/post_tag.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    private readonly userService: UserService,
    private readonly chatService: ChatService,
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
      chatTitle,
      description,
      groupSize,
      tags: tagNames,
      userId,
      chatId,
    } = createPostDto;

    const currentUser = await this.userService.findById(userId);

    if (!currentUser) {
      throw new UserDoesNotExistException();
    }

    if (chatId && chatTitle) {
      throw new Error('Choose already existing chat or create a new one.');
    }

    if (!chatId && !chatTitle) {
      throw new Error('Choose either an old chat or create a new one.');
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

    let chat: Chat | null = null;
    if (chatId) {
      chat = await this.chatService.findById(chatId);
      if (!chat) throw new Error('Chat not found');
    } else {
      chat = await this.chatService.create({
        postId: savedPost.id,
        title: chatTitle,
        max_members: groupSize,
      });
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
