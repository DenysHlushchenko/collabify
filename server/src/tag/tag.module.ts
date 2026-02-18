import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from './entities/tag.entity';
import { PostTag } from './entities/post_tag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tag, PostTag])],
  exports: [TypeOrmModule],
})
export class TagModule {}
