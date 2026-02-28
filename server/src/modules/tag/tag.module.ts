import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from './entities/tag.entity';
import { PostTag } from './entities/post_tag.entity';
import { TagService } from './tag.service';
import { TagController } from './tag.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Tag, PostTag])],
  controllers: [TagController],
  providers: [TagService],
  exports: [TagService],
})
export class TagModule {}
