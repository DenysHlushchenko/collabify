import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
import { UpdatePostDto } from './dtos/UpdatePost.dto';

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
      const postTagRepo = this.getPostTagRepository();
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

    const qb = this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.user', 'user')
      .leftJoinAndSelect('post.postTags', 'postTags')
      .leftJoinAndSelect('postTags.tag', 'tag')
      .leftJoinAndSelect('post.comments', 'comments')
      .where('post.user_id = :userId', { userId })
      .orderBy('post.created_at', 'DESC')
      .addOrderBy('post.updated_at', 'DESC');

    return await qb.getMany();
  }

  /**
   * Returns a specific post identified by provided ID.
   * @param id
   * @returns an exising post by ID; otherwise returns null.
   */
  async getPostById(id: number): Promise<Post | null> {
    return await this.postRepository.findOneOrFail({
      relations: ['user', 'postTags', 'postTags.tag', 'comments'],
      where: {
        id,
      },
    });
  }

  /**
   * Updates user's post by post ID.
   * @param updatePostDto (title, description, groupSize, postId, userId, tags).
   */
  async updatePost(
    id: number,
    updatePostDto: UpdatePostDto,
    userId: number,
  ): Promise<void> {
    const { title, description, groupSize, tags: tagNames } = updatePostDto;

    const currentUser = await this.userService.findById(userId);

    if (!currentUser) {
      throw new UserDoesNotExistException();
    }

    const post = await this.getPostById(id);
    if (!post) throw new NotFoundException('Post is not found');

    if (post.user.id !== userId) {
      throw new ForbiddenException(
        'You are not authorized to update this post',
      );
    }

    post.title = title;
    post.description = description;
    post.group_size = groupSize;

    const postTagRepo = this.getPostTagRepository();

    /* 
        Clean up the post tags, then assign the changes and save the post update
    */
    await postTagRepo.delete({ post: { id: post.id } });

    if (tagNames?.length > 0) {
      const tags = await this.tagService.findOrCreateMany(tagNames);

      post.postTags = tags.map((tag) => {
        const postTag = new PostTag();
        postTag.tag = tag;
        postTag.post = post;
        return postTag;
      });
    }

    await this.postRepository.save(post);
  }

  /**
   * Deletes a user's post by providing post ID and user ID.
   * @param postId required.
   * @param userId required.
   */
  async deletePost(postId: number, userId: number): Promise<void> {
    const currentUser = await this.userService.findById(userId);
    if (!currentUser) {
      throw new UserDoesNotExistException();
    }

    const post = await this.getPostById(postId);
    if (!post) {
      throw new NotFoundException('Post is not found');
    }

    if (post.user.id !== userId) {
      throw new ForbiddenException(
        'You are not authorized to delete this post',
      );
    }

    const postTagRepo = this.getPostTagRepository();
    await postTagRepo.delete({ post: { id: post.id } });

    await this.postRepository.delete(postId);
  }

  private getPostTagRepository(): Repository<PostTag> {
    return this.postRepository.manager.getRepository(PostTag);
  }
}
