import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../user/auth/auth.guard';
import { TagService } from './tag.service';
import { Tag } from './entities/tag.entity';

@UseGuards(AuthGuard)
@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  async getPopularTags(): Promise<Tag[]> {
    return await this.tagService.getPopularTags();
  }
}
