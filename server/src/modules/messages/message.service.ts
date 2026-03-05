import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { CreateMessageDto } from './dtos/CreateMessage.dto';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  /**
   * Creates and persists a new message. Returns the saved message with sender and chat relations.
   * @param createMessageDto - DTO containing the message content and chat ID.
   * @returns the saved Message entity including id, timestamps, sender, and chat.
   */
  async createMessage(
    createMessageDto: CreateMessageDto,
    senderId: number,
  ): Promise<Message> {
    const message = this.messageRepository.create({
      message: createMessageDto.message,
      chat: { id: createMessageDto.chatId },
      sender: { id: senderId },
    });

    const saved = await this.messageRepository.save(message);

    return this.messageRepository.findOneOrFail({
      where: { id: saved.id },
      relations: ['sender', 'chat'],
    });
  }
}
