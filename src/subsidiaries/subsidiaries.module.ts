import { Module } from '@nestjs/common';
import { SubsidiariesService } from './subsidiaries.service';
import { SubsidiariesController } from './subsidiaries.controller';
import { AzureCosmosDbModule } from '@nestjs/azure-database';
import { Subsidiary } from '../domain/entities/subsidiary.entity';
import { CommonModule } from 'src/common/common.module';
import { SubsidiariesRepository } from '../domain/repositories/subsidiaries.repository';

@Module({
  controllers: [SubsidiariesController],
  providers: [SubsidiariesService, SubsidiariesRepository],
})
export class SubsidiariesModule {}
