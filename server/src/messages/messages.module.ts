import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { MessageReaction } from './entities/message_reaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Message, MessageReaction])],
  exports: [TypeOrmModule],
})
export class MessagesModule {}
