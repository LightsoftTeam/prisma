import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { CacheModule } from '@nestjs/cache-manager';
import { PeopleRepository, UsersRepository } from 'src/domain/repositories';

@Module({
  imports: [
    CacheModule.register(),
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, PeopleRepository],
})
export class UsersModule {}
