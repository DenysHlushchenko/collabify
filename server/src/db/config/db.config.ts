import { Post } from '../../post/entities/post.entity';
import { User } from '../../user/entities/user.entity';
import { DataSourceOptions } from 'typeorm';

import * as dotenv from 'dotenv';

dotenv.config();

export const databaseConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  database: process.env.DATABASE,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  entities: [User, Post],
  synchronize: process.env.NODE_ENV !== 'production',
};
