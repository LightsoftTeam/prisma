import { Module } from '@nestjs/common';
import { CashBoxesService } from './cash-boxes.service';
import { CashBoxesController } from './cash-boxes.controller';
import { CashBoxesRepository, PeopleRepository, UsersRepository } from 'src/domain/repositories';
import { UsersService } from 'src/users/users.service';

@Module({
  controllers: [CashBoxesController],
  providers: [CashBoxesService, CashBoxesRepository, UsersRepository, PeopleRepository, UsersService],
})
export class CashBoxesModule { }
