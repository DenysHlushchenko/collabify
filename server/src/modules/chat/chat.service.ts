import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { Repository } from 'typeorm';
import { CreateChatDto } from './dtos/CreateChat.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat) private readonly chatRepository: Repository<Chat>,
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
        max_members: createChatDto.max_members,
        created_at: new Date(),
      }),
    );
  }
}
