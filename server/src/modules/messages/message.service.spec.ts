/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { MessageService } from './message.service';
import { Message } from './entities/message.entity';
import { ChatService } from '../chat/chat.service';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Chat } from '../chat/entities/chat.entity';

describe('MessageService → getMessagesByChatId', () => {
  let service: MessageService;
  let messageRepo: jest.Mocked<Repository<Message>>;
  let chatService: jest.Mocked<ChatService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessageService,
        {
          provide: getRepositoryToken(Message),
          useValue: {
            find: jest.fn(),
          },
        },
        {
          provide: ChatService,
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MessageService>(MessageService);
    messageRepo = module.get(getRepositoryToken(Message));
    chatService = module.get(ChatService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return messages ordered by created_at ASC for a given chatId', async () => {
    const chatId = 5;

    chatService.findById.mockResolvedValue({ id: chatId } as Chat);

    const mockMessages: Message[] = [
      {
        id: 1,
        message: 'Hello!',
        created_at: new Date('2026-03-01'),
        updated_at: new Date('2026-03-01'),
        sender: { id: 10, username: 'alice' } as User,
        chat: { id: chatId } as Chat,
      } as Message,
      {
        id: 2,
        message: 'Hi there!',
        created_at: new Date('2026-03-02'),
        updated_at: new Date('2026-03-02'),
        sender: { id: 20, username: 'bob' } as User,
        chat: { id: chatId } as Chat,
      } as Message,
    ];

    messageRepo.find.mockResolvedValue(mockMessages);

    const result = await service.getMessagesByChatId(chatId);

    expect(chatService.findById).toHaveBeenCalledWith(chatId);
    expect(messageRepo.find).toHaveBeenCalledWith({
      where: { chat: { id: chatId } },
      relations: ['sender'],
      order: { created_at: 'ASC' },
    });
    expect(result).toEqual(mockMessages);
    expect(result).toHaveLength(2);
  });

  it('should return an empty array when no messages exist for the chatId', async () => {
    const chatId = 99;

    chatService.findById.mockResolvedValue({ id: chatId } as Chat);
    messageRepo.find.mockResolvedValue([]);

    const result = await service.getMessagesByChatId(chatId);

    expect(chatService.findById).toHaveBeenCalledWith(chatId);
    expect(messageRepo.find).toHaveBeenCalledWith({
      where: { chat: { id: chatId } },
      relations: ['sender'],
      order: { created_at: 'ASC' },
    });
    expect(result).toEqual([]);
    expect(result).toHaveLength(0);
  });

  it('should throw NotFoundException when the chat does not exist', async () => {
    const chatId = 999;

    chatService.findById.mockResolvedValue(null);

    await expect(service.getMessagesByChatId(chatId)).rejects.toThrow(
      NotFoundException,
    );
    expect(chatService.findById).toHaveBeenCalledWith(chatId);
    expect(messageRepo.find).not.toHaveBeenCalled();
  });
});
