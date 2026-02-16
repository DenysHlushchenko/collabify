import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/db.config';

@Global()
@Module({
  imports: [TypeOrmModule.forRoot(databaseConfig)],
})
export class DatabaseModule {}
