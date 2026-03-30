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
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '../user/auth/auth.guard';
import { Message } from './entities/message.entity';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { User } from '../user/entities/user.entity';
import { ReactToMessageDto } from './dtos/ReactToMessage.dto';

@ApiTags('messages')
@UseGuards(AuthGuard)
@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get('/chats/:chatId')
  @ApiOperation({ summary: 'Get all messages for a chat' })
  @ApiParam({ name: 'chatId', description: 'The ID of the chat', type: 'number' })
  @ApiResponse({ status: 200, description: 'List of messages', type: [Message] })
  async getMessagesByChatId(
    @Param('chatId', ParseIntPipe) chatId: number,
  ): Promise<Message[]> {
    return await this.messageService.getMessagesByChatId(chatId);
  }

  @Put('/:messageId/reactions')
  @ApiOperation({ summary: 'Add a reaction to a message' })
  @ApiParam({ name: 'messageId', description: 'The ID of the message', type: 'number' })
  @ApiBody({ type: ReactToMessageDto })
  @ApiResponse({ status: 200, description: 'Reaction added successfully' })
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
