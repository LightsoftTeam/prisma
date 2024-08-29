import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { AzureCosmosDbModule } from '@nestjs/azure-database';
import { CommonModule } from './common/common.module';
import { StorageModule } from './storage/storage.module';
import { RolesModule } from './roles/roles.module';
import { SubsidiariesModule } from './subsidiaries/subsidiaries.module';
import { EnterprisesModule } from './enterprises/enterprises.module';
import { PeopleModule } from './people/people.module';
import { UbigeosModule } from './ubigeos/ubigeos.module';
import { CategoriesModule } from './categories/categories.module';
import { UnitsModule } from './units/units.module';
import { BrandsModule } from './brands/brands.module';
import { ProductsModule } from './products/products.module';
import { SuppliersModule } from './suppliers/suppliers.module';
import { SalesModule } from './sales/sales.module';
import { DomainModule } from './domain/domain.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AzureCosmosDbModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        dbName: configService.get('DB_NAME'),
        endpoint: configService.get('DB_ENDPOINT'),
        key: configService.get('DB_KEY'),
        retryAttempts: 1,
      }),
      inject: [ConfigService],
    }),
    CommonModule,
    DomainModule,
    UsersModule,
    AuthModule,
    StorageModule,
    RolesModule,
    SubsidiariesModule,
    EnterprisesModule,
    PeopleModule,
    UbigeosModule,
    CategoriesModule,
    UnitsModule,
    BrandsModule,
    ProductsModule,
    SuppliersModule,
    SalesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
