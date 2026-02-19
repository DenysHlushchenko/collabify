import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { UserService } from '../user/user.service';
import { Notification } from '../notification/entities/notification.entity';
import { NotificationService } from '../notification/notification.service';
import { User } from '../user/entities/user.entity';
import jwt from 'jsonwebtoken';

type JoinRequestType = {
  requestUserId: number;
  postCreatorId: number;
};

interface AuthenticatedSocket extends Socket {
  data: {
    user: User;
  };
}

@WebSocketGateway(5001, { cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private sessions = new Map<number, AuthenticatedSocket>();

  constructor(
    private readonly userService: UserService,
    private readonly notificationService: NotificationService,
  ) {}

  /**
   * When user logs to the app, it is automatically added to the sessions map.
   */
  async handleConnection(client: AuthenticatedSocket) {
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

      const id = client.data.user.id;

      await client.join(`user_${id}`);
      client.emit('userConnected', 'User has connected...');

      this.sessions.set(id, client);
    } catch {
      client.disconnect();
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    this.sessions.delete(client.data.user.id);
    console.log(`Client ${client.id} disconnected...`);
  }

  @SubscribeMessage('joinRequest')
  async handleJoinRequest(
    @MessageBody() joinRequest: JoinRequestType,
    @ConnectedSocket() client: Socket,
  ) {
    const { requestUserId, postCreatorId } = joinRequest;
    const requestUser = await this.userService.findById(requestUserId);
    const postCreator = await this.userService.findById(postCreatorId);

    if (!postCreator || !requestUser) {
      return client.emit('error', 'Invalid user IDs provided.');
    }

    const notification = new Notification();
    notification.type = 'request';
    notification.content = `${requestUser.username} wants to join your group chat.`;
    notification.created_at = new Date();

    notification.user = postCreator;
    await this.notificationService.create(notification);

    const postCreatorSocket = this.sessions.get(postCreatorId);
    if (postCreatorSocket) {
      this.server
        .to(`user_${postCreatorId}`)
        .emit('notification', notification);
    }
  }
}
