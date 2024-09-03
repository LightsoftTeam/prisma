import { Module } from '@nestjs/common';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { ProductsRepository, StockMovementsRepository, SalesRepository, SubsidiariesRepository, BrandsRepository, CategoriesRepository, EnterprisesRepository, UnitsRepository, UsersRepository, PeopleRepository, ErrorEventsRepository } from 'src/domain/repositories';
import { UsersService } from 'src/users/users.service';

@Module({
  controllers: [SalesController],
  providers: [
    SalesService,
    SalesRepository,
    ProductsRepository,
    StockMovementsRepository,
    SubsidiariesRepository,
    BrandsRepository,
    CategoriesRepository,
    ErrorEventsRepository,
    EnterprisesRepository,
    UnitsRepository,
    UsersRepository,
    UsersService,
    PeopleRepository,
  ],
})
export class SalesModule { }
