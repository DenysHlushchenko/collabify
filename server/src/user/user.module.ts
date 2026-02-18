import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { CountryModule } from 'src/country/country.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), CountryModule],
  controllers: [],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
