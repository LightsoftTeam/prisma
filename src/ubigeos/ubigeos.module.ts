import { Module } from '@nestjs/common';
import { UbigeosService } from './ubigeos.service';
import { UbigeosController } from './ubigeos.controller';
import { AzureCosmosDbModule } from '@nestjs/azure-database';
import { Ubigeo } from '../domain/entities/ubigeo.entity';

@Module({
  controllers: [UbigeosController],
  providers: [UbigeosService],
})
export class UbigeosModule {}
