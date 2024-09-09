import { Global, Module } from '@nestjs/common';
import { DomainService } from './domain.service';
import { DomainController } from './domain.controller';
import { AzureCosmosDbModule } from '@nestjs/azure-database';
import { User, ErrorEvent, Brand, Category, Enterprise, Person, Product, Role, Movement, Subsidiary, Supplier, Ubigeo, Unit, Kardex, Customer, CashBox } from './entities';
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

@Global()
@Module({
  controllers: [DomainController],
  providers: [
    BrandsRepository,
    DomainService, 
    CashBoxesRepository,
    CategoriesRepository,
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
