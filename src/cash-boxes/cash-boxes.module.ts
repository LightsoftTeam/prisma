import { Module } from '@nestjs/common';
import { CashBoxesService } from './cash-boxes.service';
import { CashBoxesController } from './cash-boxes.controller';
import { BrandsRepository, CashBoxesRepository, CategoriesRepository, EnterprisesRepository, KardexRepository, MovementsRepository, PaymentConceptsRepository, PeopleRepository, ProductsRepository, SubsidiariesRepository, UnitsRepository, UsersRepository } from 'src/domain/repositories';
import { UsersService } from 'src/users/users.service';
import { CashBoxTurnsRepository } from 'src/domain/repositories/cash-box-turns.repository';

@Module({
  controllers: [CashBoxesController],
  providers: [
    CashBoxesService,
    CashBoxesRepository,
    UsersRepository,
    PeopleRepository,
    UsersService,
    MovementsRepository,
    CashBoxTurnsRepository,
    KardexRepository,
    SubsidiariesRepository,
    ProductsRepository,
    BrandsRepository,
    CategoriesRepository,
    EnterprisesRepository,
    UnitsRepository,
    PaymentConceptsRepository,
  ],
})
export class CashBoxesModule { }
