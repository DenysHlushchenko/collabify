import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { UserModule } from 'src/modules/user/user.module';
import { Post } from './entities/post.entity';
import { ChatModule } from '../chat/chat.module';
import { TagModule } from '../tag/tag.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post]),
    UserModule,
    ChatModule,
    TagModule,
  ],
  controllers: [PostController],
  providers: [PostService],
  exports: [PostService],
})
export class PostModule {}
