import { Global, Module } from '@nestjs/common';
import { DomainService } from './domain.service';
import { DomainController } from './domain.controller';
import { AzureCosmosDbModule } from '@nestjs/azure-database';
import { User, Brand, Category, Enterprise, Person, Product, Role, Sale, Subsidiary, Supplier, Ubigeo, Unit } from './entities';
import { 
  BrandsRepository, 
  CategoriesRepository,
  EnterprisesRepository,
  PeopleRepository,
  ProductsRepository,
  RolesRepository,
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
    PeopleRepository,
    ProductsRepository,
    RolesRepository,
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
      { dto: Person },
      { dto: Product },
      { dto: Role },
      // { dto: Sale },
      { dto: Subsidiary },
      { dto: Supplier },
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
