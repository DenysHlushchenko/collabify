import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { Repository } from 'typeorm';
import { CreateChatDto } from './dtos/CreateChat.dto';
import { ChatMember } from './entities/chat_members.entity';
import { ChatWithOwner } from 'src/shared/types';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat) private readonly chatRepository: Repository<Chat>,
    @InjectRepository(ChatMember)
    private readonly chatMemberRepository: Repository<ChatMember>,
  ) {}

  /**
   * Finds an existing chat that matches provided ID. Returns null if no matching chat is found.
   * @param id is required. It should be the ID of the chat to be found.
   * @returns an existing chat that matches provided ID, otherwise, returns null.
   */
  findById(id: number): Promise<Chat | null> {
    return this.chatRepository.findOne({
      where: {
        id,
      },
    });
  }

  /**
   * Finds an existing chat that matches provided post ID. Returns null if no matching chat is found.
   * @param id is required. It should be the post ID of the chat to be found.
   * @returns an existing chat that matches provided post ID, otherwise, returns null.
   */
  findByPostId(postId: number): Promise<Chat | null> {
    return this.chatRepository.findOne({
      where: {
        posts: [{ id: postId }],
      },
    });
  }

  /**
   * Creates a new chat with provided information. Returns the newly created chat.
   * @param createChatDto is required. It should contain title, postId, and max_members.
   * @returns a newly created chat.
   */
  async create(createChatDto: CreateChatDto): Promise<Chat> {
    const newChat = await this.chatRepository.save(
      this.chatRepository.create({
        title: createChatDto.title,
        posts: createChatDto.postIds.map((id) => ({ id })),
        max_members: createChatDto.max_members,
        created_at: new Date(),
      }),
    );

    return newChat;
  }

  /**
   * Makes a user a member of a chat. If the user is already a member of the chat, it does nothing.
   * @param userId is required. It should be the ID of the user to be added as a member of the chat.
   * @param chatId is required. It should be the ID of the chat to which the user will be added as a member.
   */
  async makeUserMemberOfChat(userId: number, chatId: number): Promise<void> {
    const existingMember = await this.chatMemberRepository.findOne({
      where: {
        chat: { id: chatId },
        user: { id: userId },
      },
    });

    if (!existingMember) {
      const member = this.chatMemberRepository.create({
        chat: { id: chatId },
        user: { id: userId },
        joined_at: new Date(),
      });

      await this.chatMemberRepository.save(member);
    }
  }

  async addPostToChat(chatId: number, postId: number): Promise<void> {
    const alreadyLinked = await this.chatRepository
      .createQueryBuilder('chat')
      .innerJoin('chat.posts', 'p')
      .where('chat.id = :chatId', { chatId })
      .andWhere('p.id = :postId', { postId })
      .getCount();

    if (alreadyLinked === 0) {
      await this.chatRepository
        .createQueryBuilder()
        .relation(Chat, 'posts')
        .of(chatId)
        .add(postId);
    }
  }

  /**
   * Retrieves all chats that a user is a member of, along with the owner information. Returns an array of chats with owner information.
   * @param userId is required. It should be the ID of the user whose chats are to be retrieved.
   * @returns an array of chats that the user is a member of, along with the owner information. Each chat in the array includes an additional property isOwner, which indicates whether the user is the owner of the chat.
   */
  async getAllChatsByUserId(userId: number): Promise<ChatWithOwner[]> {
    const chats = await this.chatRepository.find({
      where: {
        members: {
          user: { id: userId },
        },
      },
      relations: {
        posts: {
          user: true,
        },
        members: {
          user: true,
        },
      },
      select: {
        posts: {
          id: true,
          title: true,
          user: true,
        },
        members: {
          id: true,
          joined_at: true,
          user: {
            id: true,
            username: true,
          },
        },
      },
      order: {
        created_at: 'DESC',
      },
    });

    return chats.map((chat) => ({
      ...chat,
      isOwner: chat.posts.some((post) => post.user?.id === userId),
    }));
  }
}
