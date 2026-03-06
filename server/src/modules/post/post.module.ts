import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { UserModule } from 'src/modules/user/user.module';
import { Post } from './entities/post.entity';
import { ChatModule } from '../chat/chat.module';
import { TagModule } from '../tag/tag.module';
import { CommentModule } from '../comment/comment.module';
import { PostVote } from './entities/post_vote.entity';
import { VoteModule } from 'src/shared/vote/vote.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, PostVote]),
    UserModule,
    TagModule,
    VoteModule,
    forwardRef(() => CommentModule),
    forwardRef(() => ChatModule),
  ],
  controllers: [PostController],
  providers: [PostService],
  exports: [PostService],
})
export class PostModule {}
