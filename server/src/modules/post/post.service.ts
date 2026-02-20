import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dtos/CreatePost.dto';
import { UserService } from 'src/modules/user/user.service';
import { UserDoesNotExistException } from 'src/shared/exceptions/UserDoesNotExist.exception';
import { ChatService } from '../chat/chat.service';
import { Chat } from '../chat/entities/chat.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    private readonly userService: UserService,
    private readonly chatService: ChatService,
  ) {}

  /**
   * Creates new user's post. If a user by given ID does not exist, an error is thrown, indicating that user was not found.
   * @param createPostDto (title, description, groupSize, userId).
   * @throws UserDoesNotExistException
   */
  async create(createPostDto: CreatePostDto): Promise<void> {
    const { title, chatTitle, description, groupSize, tags, userId, chatId } =
      createPostDto;

    const currentUser = await this.userService.findById(userId);

    if (!currentUser) {
      throw new UserDoesNotExistException();
    }

    let chat: Chat | null = null;
    if (chatId) {
      chat = await this.chatService.findById(chatId);
      if (!chat) throw new Error('Chat not found');
    } else {
      chat = await this.chatService.create({
        title: chatTitle,
        max_members: groupSize,
      });
    }

    await this.postRepository.save(
      this.postRepository.create({
        title,
        description,
        group_size: groupSize,
        created_at: new Date(),
        updated_at: new Date(),
        user: { id: userId },
        postTags: tags,
        chats: [chat],
      }),
    );
  }

  /**
   * Retrieves all posts from the database.
   * @returns An array of Post entities representing all posts in the database.
   */
  async getAll(): Promise<Post[]> {
    return this.postRepository.find({
      relations: ['user', 'postTags', 'comments'],
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
