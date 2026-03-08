/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { Chat } from './entities/chat.entity';

describe('ChatController → getChatByPostId', () => {
  let controller: ChatController;
  let chatService: jest.Mocked<ChatService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatController],
      providers: [
        {
          provide: ChatService,
          useValue: {
            findByPostId: jest.fn(),
            findById: jest.fn(),
            getAllChatsByUserId: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ChatController>(ChatController);
    chatService = module.get(ChatService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getChatByPostId', () => {
    const postId = 15;

    const mockChat = {
      id: 100,
      title: 'Trip to mountains',
      max_members: 4,
      created_at: new Date('2025-03-10'),
      posts: [],
      members: [
        {
          id: 300,
          joined_at: new Date(),
          user: { id: 10, username: 'alice' },
        },
        {
          id: 301,
          joined_at: new Date(),
          user: { id: 11, username: 'carol' },
        },
      ],
      messages: [],
    } as unknown as Chat;

    it('should return the chat associated with the given postId', async () => {
      chatService.findByPostId.mockResolvedValue(mockChat);

      const result = await controller.getChatByPostId(postId);

      expect(chatService.findByPostId).toHaveBeenCalledWith(postId);
      expect(result).toEqual(mockChat);
    });

    it('should return null when no chat is associated with the postId', async () => {
      chatService.findByPostId.mockResolvedValue(null);

      const result = await controller.getChatByPostId(999);

      expect(chatService.findByPostId).toHaveBeenCalledWith(999);
      expect(result).toBeNull();
    });

    it('should include members with user details in the returned chat', async () => {
      chatService.findByPostId.mockResolvedValue(mockChat);

      const result = await controller.getChatByPostId(postId);

      expect(result).not.toBeNull();
      expect(result!.members).toHaveLength(2);
      expect(result!.members[0].user).toHaveProperty('id');
      expect(result!.members[0].user).toHaveProperty('username');
    });
  });
});
