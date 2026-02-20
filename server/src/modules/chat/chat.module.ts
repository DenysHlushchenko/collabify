import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { ChatMember } from './entities/chat_members.entity';
import { ChatGateway } from './chat-gateway';
import { UserModule } from '../user/user.module';
import { NotificationModule } from '../notification/notification.module';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Chat, ChatMember]),
    UserModule,
    NotificationModule,
  ],
  controllers: [ChatController],
  providers: [ChatGateway, ChatService],
  exports: [ChatService],
})
export class ChatModule {}
