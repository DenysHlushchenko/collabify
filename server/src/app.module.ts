import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './db/db.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './user/auth/auth.module';
import { PostModule } from './post/post.module';
import { ChatModule } from './chat/chat.module';
import { CommentModule } from './comment/comment.module';
import { CountryModule } from './country/country.module';
import { FeedbackModule } from './feedback/feedback.module';
import { MessagesModule } from './messages/messages.module';
import { NotificationModule } from './notification/notification.module';
import { TagModule } from './tag/tag.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    UserModule,
    AuthModule,
    PostModule,
    ChatModule,
    CommentModule,
    CountryModule,
    FeedbackModule,
    MessagesModule,
    NotificationModule,
    TagModule,
  ],
})
export class AppModule {}
