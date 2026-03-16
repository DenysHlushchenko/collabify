import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dtos/CreateMessage.dto';
import { User } from '../user/entities/user.entity';
import jwt from 'jsonwebtoken';
import { ChatService } from '../chat/chat.service';
import { NotFoundException } from '@nestjs/common';

interface AuthenticatedSocket extends Socket {
  data: {
    user: User;
  };
}

@WebSocketGateway(5001, {
  cors: {
    origin: [
      'http://localhost:5173',
      'http://localhost',
      process.env.FRONTEND_URL,
    ].filter(Boolean),
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
})
export class MessageGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly messageService: MessageService,
    private readonly chatService: ChatService,
  ) {}

  @WebSocketServer() server: Server;

  //   Verifies JWT token on connection.
  handleConnection(client: AuthenticatedSocket) {
    const authHeader = client.handshake.headers.authorization;
    const token = authHeader?.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : null;

    if (!token) {
      client.disconnect();
      return;
    }

    try {
      const payload = jwt.verify(token, String(process.env.JWT_SECRET_KEY));
      client.data.user = payload as User;
      console.log(`Connected: ${client.id} (user ${client.data.user.id})`);
    } catch {
      client.disconnect();
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    console.log(`Disconnected: ${client.id}`);
  }

  // Allows a client to join a specific chat room.
  @SubscribeMessage('joinChat')
  handleJoinChat(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() payload: { chatId: number },
  ): void {
    const room = `chat_${payload.chatId}`;
    void client.join(room);
    console.log(`Client ${client.id} joined room ${room}`);
  }

  // Allows a client to leave a specific chat room.
  @SubscribeMessage('leaveChat')
  handleLeaveChat(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() payload: { chatId: number },
  ): void {
    const room = `chat_${payload.chatId}`;
    void client.leave(room);
    console.log(`Client ${client.id} left room ${room}`);
  }

  /**
   * Handles incoming messages from clients.
   * Sender ID is derived from the authenticated socket, not the payload.
   */
  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() payload: CreateMessageDto,
  ): Promise<void> {
    const senderId = client.data.user.id;
    const chat = await this.chatService.findById(payload.chatId);
    if (!chat) {
      throw new NotFoundException('Chat not found');
    }
    const savedMessage = await this.messageService.createMessage(
      payload,
      senderId,
    );
    this.server
      .to(`chat_${payload.chatId}`)
      .emit('receiveMessage', { savedMessage });
  }

  /**
   * Handles reactions on messages.
   * If reaction is empty, the user's reaction is removed.
   */
  @SubscribeMessage('reactToMessage')
  async handleReactToMessage(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody()
    payload: { messageId: number; chatId: number; reaction: string },
  ): Promise<void> {
    const userId = client.data.user.id;
    await this.messageService.addReactionToMessage(
      payload.messageId,
      userId,
      payload.reaction,
    );
    this.server
      .to(`chat_${payload.chatId}`)
      .emit('messageReactionUpdated', { chatId: payload.chatId });
  }

  afterInit() {
    console.log('MessageGateway initialized');
  }
}
