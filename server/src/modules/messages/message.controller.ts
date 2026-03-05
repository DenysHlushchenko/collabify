import { MessageService } from './message.service';
import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../user/auth/auth.guard';
import { Message } from './entities/message.entity';

@UseGuards(AuthGuard)
@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get('/chats/:chatId')
  async getMessagesByChatId(
    @Param('chatId', ParseIntPipe) chatId: number,
  ): Promise<Message[]> {
    return await this.messageService.getMessagesByChatId(chatId);
  }
}
