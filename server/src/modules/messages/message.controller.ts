import { MessageService } from './message.service';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../user/auth/auth.guard';
import { Message } from './entities/message.entity';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { User } from '../user/entities/user.entity';
import { ReactToMessageDto } from './dtos/ReactToMessage.dto';

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

  @Put('/:messageId/reactions')
  async addReactionToMessage(
    @Param('messageId', ParseIntPipe) messageId: number,
    @CurrentUser() user: User,
    @Body() dto: ReactToMessageDto,
  ): Promise<void> {
    return await this.messageService.addReactionToMessage(
      messageId,
      user.id,
      dto.reaction,
    );
  }
}
