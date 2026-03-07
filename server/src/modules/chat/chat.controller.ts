import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../user/auth/auth.guard';
import { ChatService } from './chat.service';
import { ChatWithOwner } from 'src/shared/types';
import { Chat } from './entities/chat.entity';

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

  @Get('users/:userId')
  async getChatsByUserId(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<ChatWithOwner[]> {
    return await this.chatService.getAllChatsByUserId(userId);
  }

  @Get(':id')
  async getChatById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Chat | null> {
    return await this.chatService.findById(id);
  }
}
