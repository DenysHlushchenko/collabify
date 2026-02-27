import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from './entities/tag.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private tagRepo: Repository<Tag>,
  ) {}

  async findOrCreateMany(names: string[]): Promise<Tag[]> {
    if (names.length === 0) return [];

    const existing = await this.tagRepo.find({
      where: { name: In(names) },
    });

    const existingSet = new Set(existing.map((t) => t.name));
    const toCreate = names.filter((name) => !existingSet.has(name));

    if (!toCreate) {
      return existing;
    }

    const newTags = toCreate.map((name) => this.tagRepo.create({ name }));
    await this.tagRepo.save(newTags);

    return [...existing, ...newTags];
  }

  //   async deleteTagsByPostId(postId: number) {}
}
