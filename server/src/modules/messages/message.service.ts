import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { CreateMessageDto } from './dtos/CreateMessage.dto';
import { ChatService } from '../chat/chat.service';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    private readonly chatService: ChatService,
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

  /**
   * Retrieves all messages for a given chat ID, including sender information, ordered by creation time ascending.
   * @param chatId - The ID of the chat for which to retrieve messages.
   * @returns an array of Message entities with sender relations, ordered by created_at ascending.
   */
  async getMessagesByChatId(chatId: number): Promise<Message[]> {
    const chat = await this.chatService.findById(chatId);
    if (!chat) {
      throw new NotFoundException(`Chat with ID ${chatId} not found`);
    }

    return this.messageRepository.find({
      where: { chat: { id: chatId } },
      relations: ['sender'],
      order: { created_at: 'ASC' },
    });
  }
}
