import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { UserModule } from 'src/modules/user/user.module';
import { Post } from './entities/post.entity';
import { TagModule } from '../tag/tag.module';

@Module({
  imports: [TypeOrmModule.forFeature([Post]), UserModule, TagModule],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
