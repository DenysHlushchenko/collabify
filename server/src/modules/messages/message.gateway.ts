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

@WebSocketGateway(5001, {
  cors: {
    origin: ['http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
})
export class MessageGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly messageService: MessageService) {}

  @WebSocketServer() server: Server;

  // Allows a client to join a specific chat room.
  @SubscribeMessage('joinChat')
  handleJoinChat(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { chatId: number },
  ): void {
    const room = `chat_${payload.chatId}`;
    void client.join(room);
    console.log(`Client ${client.id} joined room ${room}`);
  }

  // Allows a client to leave a specific chat room.
  @SubscribeMessage('leaveChat')
  handleLeaveChat(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { chatId: number },
  ): void {
    const room = `chat_${payload.chatId}`;
    void client.leave(room);
    console.log(`Client ${client.id} left room ${room}`);
  }

  // Handles incoming messages from clients.
  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: CreateMessageDto,
  ): Promise<void> {
    const savedMessage = await this.messageService.createMessage(payload);
    this.server
      .to(`chat_${payload.chatId}`)
      .emit('receiveMessage', savedMessage);
  }

  afterInit() {
    console.log('MessageGateway initialized');
  }

  handleConnection(client: Socket) {
    console.log(`Connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Disconnected: ${client.id}`);
  }
}
