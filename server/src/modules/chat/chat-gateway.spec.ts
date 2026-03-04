/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(),
}));

import { Test } from '@nestjs/testing';
import { ChatGateway } from './chat-gateway';
import { UserService } from '../user/user.service';
import { ChatService } from './chat.service';
import { NotificationService } from '../notification/notification.service';
import { Server, Socket } from 'socket.io';
import { createMock } from '@golevelup/ts-jest';
import * as jwt from 'jsonwebtoken';
import { User } from '../user/entities/user.entity';
import { Chat } from './entities/chat.entity';

describe('ChatGateway', () => {
  let gateway: ChatGateway;
  let mockUserService: jest.Mocked<UserService>;
  let mockChatService: jest.Mocked<ChatService>;
  let mockNotificationService: jest.Mocked<NotificationService>;

  const mockClient = {
    id: 'abc123',
    handshake: { headers: { authorization: 'Bearer valid-token' } },
    data: {},
    join: jest.fn(),
    emit: jest.fn(),
    disconnect: jest.fn(),
  } as unknown as Socket;

  const mockServer = {
    to: jest.fn().mockReturnThis(),
    emit: jest.fn(),
  } as unknown as Server;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ChatGateway,
        { provide: UserService, useValue: createMock<UserService>() },
        { provide: ChatService, useValue: createMock<ChatService>() },
        {
          provide: NotificationService,
          useValue: createMock<NotificationService>(),
        },
      ],
    }).compile();

    gateway = module.get<ChatGateway>(ChatGateway);
    (gateway as any).server = mockServer;
    mockUserService = module.get(UserService);
    mockChatService = module.get(ChatService);
    mockNotificationService = module.get(NotificationService);

    (jwt.verify as jest.Mock).mockReset();
    (jwt.verify as jest.Mock).mockImplementation(() => ({
      id: 42,
      username: 'alice',
    }));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('handleConnection', () => {
    it('should disconnect when no token', async () => {
      mockClient.handshake.headers.authorization = undefined;
      await gateway.handleConnection(mockClient as any);
      expect(mockClient.disconnect).toHaveBeenCalled();
    });
  });

  describe('joinRequest', () => {
    const payload = {
      requestUserId: 100,
      postCreatorId: 200,
      postId: 300,
    };

    it('should reject when authenticated user != requestUserId', async () => {
      mockClient.data.user = { id: 999 };

      await gateway.handleJoinRequest(payload, mockClient as any);

      expect(mockClient.emit).toHaveBeenCalledWith(
        'error',
        expect.stringContaining('Unauthorized'),
      );
    });

    it('should create notification and emit to post creator when valid', async () => {
      const mockPostCreatorSocket = { emit: jest.fn() } as unknown as Socket;
      gateway['sessions'].set(200, mockPostCreatorSocket);

      mockClient.data.user = { id: 100 } as User;

      mockUserService.findById
        .mockResolvedValueOnce({ id: 100, username: 'bob' } as User)
        .mockResolvedValueOnce({ id: 200, username: 'alice' } as User);

      mockChatService.findByPostId.mockResolvedValueOnce({
        id: 88,
        title: 'Hiking Group',
      } as Chat);

      mockNotificationService.create.mockResolvedValue(undefined);

      await gateway.handleJoinRequest(payload, mockClient as any);

      expect(mockNotificationService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'request',
          content: 'bob wants to join your Hiking Group chat.',
          postId: 300,
          user: expect.objectContaining({ id: 200, username: 'alice' }),
          fromUser: expect.objectContaining({ id: 100, username: 'bob' }),
          created_at: expect.any(Date),
        }),
      );

      expect(mockServer.to).toHaveBeenCalledWith('user_200');
      expect(mockServer.emit).toHaveBeenCalledWith(
        'notification_join_request',
        expect.objectContaining({
          notification: expect.any(Object),
        }),
      );
    });
  });
});
