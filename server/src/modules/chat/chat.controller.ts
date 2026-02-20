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

@UseGuards(AuthGuard)
@Controller('chats')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('users/:userId')
  async getChatsByUserId(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<ChatWithOwner[]> {
    return await this.chatService.getAllChatsByUserId(userId);
  }
}
