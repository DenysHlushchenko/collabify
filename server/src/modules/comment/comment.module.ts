import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { UserModule } from '../user/user.module';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { PostModule } from '../post/post.module';
import { CommentVote } from './entities/comment_vote.entity';
import { VoteModule } from 'src/shared/vote/vote.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment, CommentVote]),
    UserModule,
    forwardRef(() => PostModule),
    VoteModule,
  ],
  controllers: [CommentController],
  providers: [CommentService],
  exports: [CommentService],
})
export class CommentModule {}
