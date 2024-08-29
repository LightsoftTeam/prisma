import { Module } from '@nestjs/common';
import { BrandsService } from './brands.service';
import { BrandsController } from './brands.controller';
import { BrandsRepository } from 'src/domain/repositories';

@Module({
  controllers: [BrandsController],
  providers: [BrandsService, BrandsRepository],
})
export class BrandsModule {}
