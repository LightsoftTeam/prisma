import { Module } from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { SuppliersController } from './suppliers.controller';
import { PeopleRepository, SuppliersRepository } from 'src/domain/repositories';

@Module({
  controllers: [SuppliersController],
  providers: [SuppliersService, SuppliersRepository, PeopleRepository],
})
export class SuppliersModule {}
