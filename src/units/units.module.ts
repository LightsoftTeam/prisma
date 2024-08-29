import { Module } from '@nestjs/common';
import { UnitsService } from './units.service';
import { UnitsController } from './units.controller';
import { AzureCosmosDbModule } from '@nestjs/azure-database';
import { Unit } from './entities/unit.entity';
import { CommonModule } from 'src/common/common.module';

@Module({
  controllers: [UnitsController],
  providers: [UnitsService],
  imports: [
    AzureCosmosDbModule.forFeature([{
      dto: Unit,
    }]),
    CommonModule,
  ],
  exports: [
    AzureCosmosDbModule,
  ]
})
export class UnitsModule { }
