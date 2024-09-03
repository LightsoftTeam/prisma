import { Global, Module } from '@nestjs/common';
import { DomainService } from './domain.service';
import { DomainController } from './domain.controller';
import { AzureCosmosDbModule } from '@nestjs/azure-database';
import { User, ErrorEvent, Brand, Category, Enterprise, Person, Product, Role, Sale, Subsidiary, Supplier, Ubigeo, Unit, StockMovement } from './entities';
import { 
  BrandsRepository, 
  CategoriesRepository,
  EnterprisesRepository,
  ErrorEventsRepository,
  PeopleRepository,
  ProductsRepository,
  RolesRepository,
  SalesRepository,
  StockMovementsRepository,
  SubsidiariesRepository,
  SuppliersRepository,
  UnitsRepository,
  UsersRepository 
} from './repositories';

@Global()
@Module({
  controllers: [DomainController],
  providers: [
    BrandsRepository,
    DomainService, 
    CategoriesRepository,
    EnterprisesRepository,
    ErrorEventsRepository,
    PeopleRepository,
    ProductsRepository,
    RolesRepository,
    SalesRepository,
    StockMovementsRepository,
    SubsidiariesRepository,
    SuppliersRepository,
    UnitsRepository,
    UsersRepository,
  ],
  imports: [
    AzureCosmosDbModule.forFeature([
      { dto: Brand },
      { dto: Category },
      { dto: Enterprise },
      { dto: ErrorEvent },
      { dto: Person },
      { dto: Product },
      { dto: Role },
      { dto: Sale },
      { dto: Subsidiary },
      { dto: Supplier },
      { dto: StockMovement },
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
