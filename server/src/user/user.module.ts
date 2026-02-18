import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { Country } from 'src/country/entities/country.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Country])],
  controllers: [],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
