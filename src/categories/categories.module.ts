import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { AzureCosmosDbModule } from '@nestjs/azure-database';
import { Category } from './entities/category.entity';
import { CommonModule } from 'src/common/common.module';
import { EnterprisesService } from 'src/enterprises/enterprises.service';
import { EnterprisesModule } from 'src/enterprises/enterprises.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService, EnterprisesService],
  imports: [
    AzureCosmosDbModule.forFeature([{
      dto: Category,
    }]),
    CommonModule,
    EnterprisesModule,
    HttpModule
  ],
  exports: [
    AzureCosmosDbModule,
    EnterprisesService,
  ]
})
export class CategoriesModule {}
