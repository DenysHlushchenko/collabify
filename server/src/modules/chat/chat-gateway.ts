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
// import { JoinResponse } from 'src/shared/enums/enums';

type JoinRequestType = {
  requestUserId: number;
  postCreatorId: number;
};

// type JoinResponseType = {
//   response: string;
//   requestUserId: number;
//   postCreatorId: number;
// };

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
    @ConnectedSocket() client: Socket,
  ) {
    const { requestUserId, postCreatorId } = joinRequest;
    const requestUser = await this.findUserById(requestUserId);
    const postCreator = await this.findUserById(postCreatorId);

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
        .emit('notification_join_request', { notification, requestUserId });
    }
  }

  /**
   * Handles incoming join request from user that wants to join the chat group.
   * @param joinResponse
   * @param client
   * @returns approval or rejecton. If join response is invalid, the process will end.
   */
  //   @SubscribeMessage('joinResponse')
  //   async handleJoinResponse(
  //     @MessageBody() joinResponse: JoinResponseType,
  //     @ConnectedSocket() client: Socket,
  //   ) {
  //     const { requestUserId, postCreatorId, response } = joinResponse;
  //     const requestUser = await this.findUserById(requestUserId);
  //     const postCreator = await this.findUserById(postCreatorId);

  //     if (!requestUser || !postCreator)
  //       return client.emit('error', 'Invalid user IDs provided.');

  //     const notification = new Notification();
  //     notification.type = 'response';
  //     notification.created_at = new Date();

  //     if (response === JoinResponse.APPROVE) {
  //       // handle approve
  //       notification.content = `${postCreator.username} accepted your request!`;
  //       // create chat
  //       // connect two users
  //     } else if (response === JoinResponse.REJECT) {
  //       // handle reject
  //       // disconnect users from server
  //       notification.content = `${postCreator.username} declined your request.`;
  //     } else {
  //       return client.emit('error', 'Invalid response.');
  //     }

  //     this.server
  //       .to(`user_${requestUserId}`)
  //       .emit('notification_join_response', { notification });
  //   }
}
