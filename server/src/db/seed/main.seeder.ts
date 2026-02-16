import { Post } from '../../post/entities/post.entity';
import { User } from '../../user/entities/user.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

const POSTS_FACTORY = [
  {
    title: 'Post 1',
    description: 'Post description 1',
    group_size: 5,
    user: { id: 1 },
  },
  {
    title: 'Post 2',
    description: 'Post description 2',
    group_size: 2,
    user: { id: 2 },
  },
];

export class MainSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    const userFactory = factoryManager.get(User);
    const postRepository = dataSource.getRepository(Post);

    console.log('Seeding users...');
    await userFactory.saveMany(5);

    console.log('Seeding posts...');
    await postRepository.save(POSTS_FACTORY);

    console.log('Seeding process is finished');
  }
}
