import { Global, Module } from '@nestjs/common';
import { DomainService } from './domain.service';
import { DomainController } from './domain.controller';
import { AzureCosmosDbModule } from '@nestjs/azure-database';
import { User, ErrorEvent, Brand, Category, Enterprise, Person, Product, Role, Movement, Subsidiary, Supplier, Ubigeo, Unit, Kardex, Customer, CashBox, CashBoxTurn } from './entities';
import { 
  BrandsRepository, 
  CategoriesRepository,
  EnterprisesRepository,
  ErrorEventsRepository,
  PeopleRepository,
  ProductsRepository,
  RolesRepository,
  MovementsRepository,
  KardexRepository,
  SubsidiariesRepository,
  SuppliersRepository,
  UnitsRepository,
  UsersRepository, 
  CustomersRepository,
  CashBoxesRepository
} from './repositories';
import { CashBoxTurnsRepository } from './repositories/cash-box-turns.repository';

@Global()
@Module({
  controllers: [DomainController],
  providers: [
    BrandsRepository,
    DomainService, 
    CashBoxesRepository,
    CategoriesRepository,
    CashBoxTurnsRepository,
    CustomersRepository,
    EnterprisesRepository,
    ErrorEventsRepository,
    PeopleRepository,
    ProductsRepository,
    RolesRepository,
    MovementsRepository,
    KardexRepository,
    SubsidiariesRepository,
    SuppliersRepository,
    UnitsRepository,
    UsersRepository,
  ],
  imports: [
    AzureCosmosDbModule.forFeature([
      { dto: Brand },
      { dto: CashBox },
      { dto: CashBoxTurn },
      { dto: Category },
      { dto: Customer },
      { dto: Enterprise },
      { dto: ErrorEvent },
      { dto: Person },
      { dto: Product },
      { dto: Role },
      { dto: Movement },
      { dto: Subsidiary },
      { dto: Supplier },
      { dto: Kardex },
      // { dto: Ubigeo },
      { dto: Unit },
      { dto: User },
    ]),
  ],
  exports: [
    AzureCosmosDbModule
  ]
})
export class DomainModule { }
