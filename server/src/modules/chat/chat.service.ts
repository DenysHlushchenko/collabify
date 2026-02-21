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

  findById(id: number): Promise<Chat | null> {
    return this.chatRepository.findOne({
      where: {
        id,
      },
    });
  }

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
      isOwner: chat.post.user.id === userId,
    }));
  }
}
