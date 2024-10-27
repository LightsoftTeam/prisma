import { Module } from '@nestjs/common';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { UsersService } from 'src/users/users.service';

@Module({
  controllers: [SalesController],
  providers: [
    SalesService,
    UsersService,
  ],
})
export class SalesModule { }
