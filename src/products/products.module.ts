import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { AzureCosmosDbModule } from '@nestjs/azure-database';
import { Product } from './entities/product.entity';
import { CommonModule } from 'src/common/common.module';
import { CategoriesService } from 'src/categories/categories.service';
import { CategoriesModule } from 'src/categories/categories.module';
import { UnitsService } from 'src/units/units.service';
import { BrandsService } from 'src/brands/brands.service';
import { UnitsModule } from 'src/units/units.module';
import { BrandsModule } from 'src/brands/brands.module';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, CategoriesService, UnitsService, BrandsService],
  imports: [
    AzureCosmosDbModule.forFeature([
      {
        dto: Product,
      }
    ]),
    CommonModule,
    CategoriesModule,
    UnitsModule,
    BrandsModule,
  ],
})
export class ProductsModule {}
