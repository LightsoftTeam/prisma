import { Module } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { EnterprisesRepository, PeopleRepository, CustomersRepository, UsersRepository } from 'src/domain/repositories';
import { UsersService } from 'src/users/users.service';

@Module({
  controllers: [CustomersController],
  providers: [CustomersService, PeopleRepository, EnterprisesRepository, CustomersRepository, UsersService, UsersRepository],
})
export class CustomersModule {}
