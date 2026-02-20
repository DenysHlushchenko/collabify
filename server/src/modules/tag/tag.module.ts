import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from './entities/tag.entity';
import { PostTag } from './entities/post_tag.entity';
import { TagService } from './tag.service';

@Module({
  imports: [TypeOrmModule.forFeature([Tag, PostTag])],
  providers: [TagService],
  exports: [TagService],
})
export class TagModule {}
