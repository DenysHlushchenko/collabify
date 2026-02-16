import { User } from '../../user/entities/user.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export class MainSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    const userFactory = factoryManager.get(User);

    console.log('Seeding users...');
    await userFactory.saveMany(5);
    console.log('Seeding process is finished');
  }
}
