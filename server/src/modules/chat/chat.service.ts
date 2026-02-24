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
        post: { id: postId },
      },
    });
  }

  /**
   * Creates a new chat with provided information. Returns the newly created chat.
   * @param createChatDto is required. It should contain title, postId, and max_members.
   * @returns a newly created chat.
   */
  async create(createChatDto: CreateChatDto): Promise<Chat> {
    return await this.chatRepository.save(
      this.chatRepository.create({
        title: createChatDto.title,
        post: { id: createChatDto.postId },
        max_members: createChatDto.max_members,
        created_at: new Date(),
      }),
    );
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
        post: {
          user: true,
        },
        members: {
          user: true,
        },
      },
      select: {
        post: {
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
      isOwner: chat.post?.user?.id === userId,
    }));
  }
}
