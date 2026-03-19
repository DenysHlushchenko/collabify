import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../user/auth/auth.guard';
import { ChatService } from './chat.service';
import { ChatWithOwner } from 'src/shared/types';
import { Chat } from './entities/chat.entity';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { User } from '../user/entities/user.entity';

@UseGuards(AuthGuard)
@Controller('chats')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('posts/:postId')
  async getChatByPostId(
    @Param('postId', ParseIntPipe) postId: number,
  ): Promise<Chat | null> {
    return await this.chatService.findByPostId(postId);
  }

  @Get(':id')
  async getChatById(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ): Promise<ChatWithOwner> {
    return await this.chatService.findByUserId(id, user.id);
  }

  @Get('users/:userId')
  async getChatsByUserId(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<ChatWithOwner[]> {
    return await this.chatService.getAllChatsByUserId(userId);
  }

  @Delete(':id/users/:userId')
  async deleteChat(
    @Param('id', ParseIntPipe) chatId: number,
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<void> {
    return await this.chatService.deleteChat(chatId, userId);
  }
}
