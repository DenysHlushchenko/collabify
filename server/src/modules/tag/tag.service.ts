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

  /**
   * Finds existing tags by name or creates new ones if they don't exist.
   * @param names Array of tag names to find or create.
   * @returns Promise resolving to an array of Tag entities corresponding to the provided names.
   */
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

  /**
   * Retrieves the top 10 most popular tags based on the number of posts associated with each tag. The tags are ordered in descending order of popularity.
   * @returns Promise resolving to an array of Tag entities, each with an additional 'postCount' property indicating the number of posts associated with that tag.
   */
  async getPopularTags(): Promise<Tag[]> {
    return await this.tagRepo
      .createQueryBuilder('tag')
      .loadRelationCountAndMap('tag.postCount', 'tag.postTags')
      .orderBy(
        `(SELECT COUNT(*) FROM post_tags pt WHERE pt.tag_id = tag.id)`,
        'DESC',
      )
      .limit(10)
      .getMany();
  }
}
