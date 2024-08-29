import { Module } from '@nestjs/common';
import { UnitsService } from './units.service';
import { UnitsController } from './units.controller';
import { UnitsRepository } from 'src/domain/repositories';

@Module({
  controllers: [UnitsController],
  providers: [UnitsService, UnitsRepository],
})
export class UnitsModule { }
