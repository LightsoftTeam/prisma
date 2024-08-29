import { Module } from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { SuppliersController } from './suppliers.controller';
import { PeopleService } from 'src/people/people.service';
import { PeopleModule } from 'src/people/people.module';
import { AzureCosmosDbModule } from '@nestjs/azure-database';
import { Supplier } from './entities/supplier.entity';
import { CommonModule } from 'src/common/common.module';

@Module({
  controllers: [SuppliersController],
  providers: [SuppliersService, PeopleService],
  imports: [
    AzureCosmosDbModule.forFeature([
      {
        dto: Supplier
      }
    ]),
    CommonModule,
    PeopleModule
  ],
})
export class SuppliersModule {}
