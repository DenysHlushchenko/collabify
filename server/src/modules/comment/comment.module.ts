import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { UserModule } from '../user/user.module';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { PostModule } from '../post/post.module';
import { CommentVote } from './entities/comment_vote.entity';
import { VoteService } from 'src/shared/vote/vote.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment, CommentVote]),
    UserModule,
    PostModule,
  ],
  controllers: [CommentController],
  providers: [CommentService, VoteService],
  exports: [CommentService],
})
export class CommentModule {}
