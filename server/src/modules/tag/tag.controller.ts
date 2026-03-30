import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '../user/auth/auth.guard';
import { TagService } from './tag.service';
import { Tag } from './entities/tag.entity';

@ApiTags('tags')
@UseGuards(AuthGuard)
@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  @ApiOperation({ summary: 'Get popular tags' })
  @ApiResponse({ status: 200, description: 'List of popular tags', type: [Tag] })
  async getPopularTags(): Promise<Tag[]> {
    return await this.tagService.getPopularTags();
  }
}
