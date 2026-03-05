import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { MessageReaction } from './entities/message_reaction.entity';
import { MessageGateway } from './message.gateway';
import { MessageService } from './message.service';
import { ChatModule } from '../chat/chat.module';

@Module({
  imports: [TypeOrmModule.forFeature([Message, MessageReaction, ChatModule])],
  providers: [MessageGateway, MessageService],
  exports: [TypeOrmModule, MessageService],
})
export class MessagesModule {}
