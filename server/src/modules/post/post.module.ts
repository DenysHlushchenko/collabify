import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { UserModule } from 'src/modules/user/user.module';
import { Post } from './entities/post.entity';
import { ChatModule } from '../chat/chat.module';
import { TagModule } from '../tag/tag.module';
import { PostVote } from './entities/post_vote.entity';
import { PostVoteService } from './post_vote/post_vote.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, PostVote]),
    UserModule,
    ChatModule,
    TagModule,
  ],
  controllers: [PostController],
  providers: [PostService, PostVoteService],
  exports: [PostService],
})
export class PostModule {}
