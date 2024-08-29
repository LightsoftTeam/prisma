import { Module } from '@nestjs/common';
import { BrandsService } from './brands.service';
import { BrandsController } from './brands.controller';
import { AzureCosmosDbModule } from '@nestjs/azure-database';
import { Brand } from './entities/brand.entity';
import { CommonModule } from 'src/common/common.module';

@Module({
  controllers: [BrandsController],
  providers: [BrandsService],
  imports: [
    AzureCosmosDbModule.forFeature([{
      dto: Brand,
    }]),
    CommonModule,
  ],
  exports: [
    AzureCosmosDbModule,
  ]
})
export class BrandsModule {}
