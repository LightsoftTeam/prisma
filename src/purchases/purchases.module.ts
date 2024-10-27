import { Module } from '@nestjs/common';
import { PurchasesService } from './purchases.service';
import { PurchasesController } from './purchases.controller';
import { UsersService } from 'src/users/users.service';

@Module({
  controllers: [PurchasesController],
  providers: [
    PurchasesService,
    UsersService,
  ],
})
export class PurchasesModule {}
