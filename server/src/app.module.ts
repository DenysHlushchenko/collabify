import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './db/db.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/user/auth/auth.module';
import { PostModule } from './modules/post/post.module';
import { ChatModule } from './modules/chat/chat.module';
import { CommentModule } from './modules/comment/comment.module';
import { CountryModule } from './modules/country/country.module';
import { FeedbackModule } from './modules/feedback/feedback.module';
import { MessagesModule } from './modules/messages/messages.module';
import { NotificationModule } from './modules/notification/notification.module';
import { TagModule } from './modules/tag/tag.module';
import { VoteModule } from './shared/vote/vote.module';

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
    VoteModule,
  ],
})
export class AppModule {}
