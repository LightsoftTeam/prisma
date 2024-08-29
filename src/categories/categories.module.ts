import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { HttpModule } from '@nestjs/axios';
import { CategoriesRepository } from 'src/domain/repositories';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService, CategoriesRepository],
  imports: [
    HttpModule
  ],
})
export class CategoriesModule {}
