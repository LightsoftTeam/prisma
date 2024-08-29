import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { BrandsRepository, CategoriesRepository, EnterprisesRepository, ProductsRepository, UnitsRepository } from 'src/domain/repositories';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, ProductsRepository, CategoriesRepository, BrandsRepository, EnterprisesRepository, UnitsRepository],
})
export class ProductsModule {}
