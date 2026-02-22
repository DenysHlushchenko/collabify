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

    // make post creator a member of the chat
    await this.chatService.makeUserMemberOfChat(userId, chat.id);
  }

  /**
   * Retrieves all posts from the database.
   * @returns An array of Post entities representing all posts in the database.
   */
  async getAll(
    options: {
      search?: string;
      sort?: 'ASC' | 'DESC';
    } = {},
  ): Promise<Post[]> {
    const { search, sort = 'DESC' } = options;

    const db = this.postRepository.createQueryBuilder('post');

    db.leftJoinAndSelect('post.user', 'user');
    db.leftJoinAndSelect('user.country', 'country');
    db.leftJoinAndSelect('post.postTags', 'postTags');
    db.leftJoinAndSelect('postTags.tag', 'tag');
    db.leftJoinAndSelect('post.comments', 'comments');

    if (search) {
      const searchTerm = `%${search}%`;
      db.where(`(post.title ILIKE :search OR tag.name ILIKE :search)`, {
        search: searchTerm,
      });
    }

    db.orderBy('post.created_at', sort);

    return await db.getMany();
  }

  /**
   * Retrevies all user-specific posts from the database.
   * @param userId
   * @returns An array of Post entities by user ID.
   */
  async getAllPostsByUserId(userId: number): Promise<Post[]> {
    const existingUser = await this.userService.findById(userId);

    if (!existingUser) {
      throw new UserDoesNotExistException();
    }

    return await this.postRepository.find({
      relations: ['postTags.tag', 'comments'],
      where: {
        user: existingUser,
      },
      order: {
        created_at: 'DESC',
        updated_at: 'DESC',
      },
    });
  }
}
