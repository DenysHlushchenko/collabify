/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
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
import { JoinResponse } from 'src/shared/enums/enums';
import { ChatService } from './chat.service';
import { NotFoundException } from '@nestjs/common';

type JoinRequestType = {
  requestUserId: number;
  postCreatorId: number;
  postId: number;
};

type JoinResponseType = {
  response: string;
  requestUserId: number;
  postCreatorId: number;
  postId: number;
};

interface AuthenticatedSocket extends Socket {
  data: {
    user: User;
  };
}

@WebSocketGateway(5001, {
  cors: {
    origin: ['http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private sessions = new Map<number, AuthenticatedSocket>();

  constructor(
    private readonly userService: UserService,
    private readonly chatService: ChatService,
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
      client.emit(
        'userConnected',
        `User ${client.data.user.username} has connected...`,
      );

      this.sessions.set(id, client);
    } catch {
      client.disconnect();
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    const userId = client.data?.user?.id;
    if (userId !== undefined) {
      this.sessions.delete(userId);
    }
    console.log(`Client ${client.id} disconnected...`);
  }

  async findUserById(id: number) {
    return await this.userService.findById(id);
  }

  /**
   * Handles sender join request to post creator.
   * @param joinRequest
   * @param client
   * @returns a request to the post creator.
   */
  @SubscribeMessage('joinRequest')
  async handleJoinRequest(
    @MessageBody() joinRequest: JoinRequestType,
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    const { requestUserId, postCreatorId, postId } = joinRequest;

    // Verify the authenticated user matches the request
    if (client.data.user?.id !== requestUserId) {
      return client.emit('error', 'Unauthorized: User ID mismatch.');
    }

    const requestUser = await this.findUserById(requestUserId);
    const postCreator = await this.findUserById(postCreatorId);

    if (!postCreator || !requestUser) {
      return client.emit('error', 'Invalid user IDs provided.');
    }

    // find group chat name by postId and add it to the notification content
    const chat = await this.chatService.findByPostId(postId);
    if (!chat) throw new NotFoundException('Chat does not exist');

    const notification = new Notification();
    notification.type = 'request';
    notification.content = `${requestUser.username} wants to join your ${chat.title} chat.`;
    notification.created_at = new Date();
    notification.postId = postId;
    notification.user = postCreator;
    notification.fromUser = requestUser;

    await this.notificationService.create(notification);

    const postCreatorSocket = this.sessions.get(postCreatorId);
    if (postCreatorSocket) {
      this.server
        .to(`user_${postCreatorId}`)
        .emit('notification_join_request', { notification });
    }
  }

  /**
   * Handles incoming join request from user that wants to join the chat group.
   * @param joinResponse
   * @param responseClient
   * @returns approval or rejecton. If join response is invalid, the process will end.
   */
  @SubscribeMessage('joinResponse')
  async handleJoinResponse(
    @MessageBody() joinResponse: JoinResponseType,
    @ConnectedSocket() responseClient: Socket,
  ) {
    const { requestUserId, postCreatorId, postId, response } = joinResponse;
    const requestUser = await this.findUserById(requestUserId);
    const postCreator = await this.findUserById(postCreatorId);

    if (!requestUser || !postCreator)
      return responseClient.emit('error', 'Invalid user IDs provided.');

    const notification = new Notification();
    notification.type = 'response';
    notification.created_at = new Date();
    notification.postId = postId;
    notification.user = requestUser;
    notification.fromUser = postCreator;

    if (response === JoinResponse.APPROVE) {
      const chat = await this.chatService.findByPostId(postId);
      if (!chat) throw new NotFoundException('Chat does not exist');
      notification.content = `${postCreator.username} accepted your request!`;
      // join the sender to the chat
      // connect the sender to the chat room
      await this.chatService.makeUserMemberOfChat(requestUserId, chat.id);
    } else if (response === JoinResponse.REJECT) {
      // handle reject
      // disconnect users from server
      const requestClient = this.sessions.get(requestUserId);
      this.handleDisconnect(requestClient!);
      notification.content = `${postCreator.username} declined your request.`;
    } else {
      return responseClient.emit('error', 'Invalid response.');
    }

    await this.notificationService.create(notification);

    this.server
      .to(`user_${requestUserId}`)
      .emit('notification_join_response', { notification });
  }
}
