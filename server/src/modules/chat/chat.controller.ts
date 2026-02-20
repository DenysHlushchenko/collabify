import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../user/auth/auth.guard';
import { ChatService } from './chat.service';
import { Chat } from './entities/chat.entity';

@UseGuards(AuthGuard)
@Controller('chats')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('users/:userId')
  async getChatsByUserId(@Param('userId') userId: number): Promise<Chat[]> {
    return await this.chatService.getAllChatsByUserId(userId);
  }
}
