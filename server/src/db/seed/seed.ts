import { DataSourceOptions } from 'typeorm';
import { runSeeders, SeederOptions } from 'typeorm-extension';
import { databaseConfig } from '../config/db.config';
import { MainSeeder } from './main.seeder';
import { DataSource } from 'typeorm';
import { UserFactory } from './user.factory';

const options: DataSourceOptions & SeederOptions = {
  ...databaseConfig,
  factories: [UserFactory],
  seeds: [MainSeeder],
};

const dataSource = new DataSource(options);
void dataSource.initialize().then(async () => {
  await dataSource.synchronize(true);
  await runSeeders(dataSource);
  process.exit();
});
