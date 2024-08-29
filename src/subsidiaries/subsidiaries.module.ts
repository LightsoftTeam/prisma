import { Module } from '@nestjs/common';
import { SubsidiariesService } from './subsidiaries.service';
import { SubsidiariesController } from './subsidiaries.controller';
import { AzureCosmosDbModule } from '@nestjs/azure-database';
import { Subsidiary } from '../domain/entities/subsidiary.entity';
import { CommonModule } from 'src/common/common.module';

@Module({
  controllers: [SubsidiariesController],
  providers: [SubsidiariesService],
})
export class SubsidiariesModule {}
