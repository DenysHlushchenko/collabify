import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { MessageReaction } from './entities/message_reaction.entity';
import { CreateMessageDto } from './dtos/CreateMessage.dto';
import { ChatService } from '../chat/chat.service';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(MessageReaction)
    private readonly reactionRepository: Repository<MessageReaction>,
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
      isChatJoinMessage: createMessageDto.isChatJoinMessage || false,
      created_at: new Date(),
    });

    const saved = await this.messageRepository.save(message);

    return this.messageRepository.findOneOrFail({
      where: { id: saved.id },
      relations: ['sender', 'chat'],
    });
  }

  /**
   * Retrieves all messages for a given chat ID, including sender and reactions, ordered by creation time ascending.
   * @param chatId - The ID of the chat for which to retrieve messages.
   * @returns an array of Message entities with sender and reactions relations, ordered by created_at ascending.
   */
  async getMessagesByChatId(chatId: number): Promise<Message[]> {
    const chat = await this.chatService.findById(chatId);
    if (!chat) {
      throw new NotFoundException(`Chat with ID ${chatId} not found`);
    }

    return this.messageRepository.find({
      where: { chat: { id: chatId } },
      relations: ['sender', 'reactions', 'reactions.user'],
      order: { created_at: 'ASC' },
    });
  }

  /**
   * Adds or updates a reaction for a message by a user. If the reaction is an empty string, it removes the user's reaction.
   * @param messageId - The ID of the message to react to.
   * @param userId - The ID of the user reacting to the message.
   * @param reaction - The reaction emoji. If empty, the user's reaction will be removed.
   */
  async addReactionToMessage(
    messageId: number,
    userId: number,
    reaction: string,
  ): Promise<void> {
    const message = await this.messageRepository.findOne({
      where: { id: messageId },
    });

    if (!message) {
      throw new NotFoundException(`Message with ID ${messageId} not found`);
    }

    if (!reaction) {
      await this.reactionRepository.delete({
        message: { id: messageId },
        user: { id: userId },
      });
    } else {
      await this.reactionRepository.upsert(
        {
          reaction,
          message: { id: messageId },
          user: { id: userId },
        },
        ['message', 'user'],
      );
    }
  }
}
