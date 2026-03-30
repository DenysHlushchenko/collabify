import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { AuthGuard } from '../user/auth/auth.guard';
import { ChatService } from './chat.service';
import { ChatWithOwner } from 'src/shared/types';
import { Chat } from './entities/chat.entity';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { User } from '../user/entities/user.entity';

@ApiTags('chats')
@UseGuards(AuthGuard)
@Controller('chats')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('posts/:postId')
  @ApiOperation({ summary: 'Get chat by post ID' })
  @ApiParam({
    name: 'postId',
    description: 'The ID of the post',
    type: 'number',
  })
  @ApiResponse({
    status: 200,
    description: 'The chat for the given post ID',
    type: Chat,
  })
  @ApiResponse({ status: 404, description: 'Chat not found' })
  async getChatByPostId(
    @Param('postId', ParseIntPipe) postId: number,
  ): Promise<Chat | null> {
    return await this.chatService.findByPostId(postId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get chat by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the chat', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'The chat with the given ID',
    type: Chat,
  })
  @ApiResponse({ status: 404, description: 'Chat not found' })
  async getChatById(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ): Promise<ChatWithOwner> {
    return await this.chatService.findByUserId(id, user.id);
  }

  @Get('users/:userId')
  @ApiOperation({ summary: 'Get all chats for a user' })
  @ApiParam({
    name: 'userId',
    description: 'The ID of the user',
    type: 'number',
  })
  @ApiResponse({
    status: 200,
    description: 'A list of chats for the user',
    type: [Chat],
  })
  async getChatsByUserId(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<ChatWithOwner[]> {
    return await this.chatService.getAllChatsByUserId(userId);
  }

  @Delete(':id/users/:userId')
  @ApiOperation({ summary: 'Delete a chat' })
  @ApiParam({ name: 'id', description: 'The ID of the chat', type: 'number' })
  @ApiParam({
    name: 'userId',
    description: 'The ID of the user',
    type: 'number',
  })
  @ApiResponse({ status: 204, description: 'Chat deleted successfully' })
  @ApiResponse({ status: 404, description: 'Chat not found' })
  async deleteChat(
    @Param('id', ParseIntPipe) chatId: number,
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<void> {
    return await this.chatService.deleteChat(chatId, userId);
  }
}
