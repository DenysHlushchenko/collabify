import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { ChatMember } from './entities/chat_members.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Chat, ChatMember])],
  exports: [TypeOrmModule],
})
export class ChatModule {}
