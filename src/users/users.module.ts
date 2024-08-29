import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { AzureCosmosDbModule } from '@nestjs/azure-database';
import { CacheModule } from '@nestjs/cache-manager';
import { CommonModule } from 'src/common/common.module';
import { RolesService } from 'src/roles/roles.service';
import { PeopleService } from 'src/people/people.service';
import { RolesModule } from 'src/roles/roles.module';
import { PeopleModule } from 'src/people/people.module';

@Module({
  imports: [
    AzureCosmosDbModule.forFeature([
      {dto: User}
    ]),
    CacheModule.register(),
    CommonModule,
    RolesModule,
    PeopleModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, RolesService, PeopleService],
  exports: [UsersService, AzureCosmosDbModule, CacheModule, RolesService, PeopleService],
})
export class UsersModule {}
