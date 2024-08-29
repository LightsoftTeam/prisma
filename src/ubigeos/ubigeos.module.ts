import { Module } from '@nestjs/common';
import { UbigeosService } from './ubigeos.service';
import { UbigeosController } from './ubigeos.controller';
import { AzureCosmosDbModule } from '@nestjs/azure-database';
import { Ubigeo } from './entities/ubigeo.entity';

@Module({
  controllers: [UbigeosController],
  providers: [UbigeosService],
  imports: [
    AzureCosmosDbModule.forFeature([
      {dto: Ubigeo}
    ]),
  ],
})
export class UbigeosModule {}
