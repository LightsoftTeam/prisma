import { Module } from '@nestjs/common';
import { PeopleService } from './people.service';
import { PeopleController } from './people.controller';
import { AzureCosmosDbModule } from '@nestjs/azure-database';
import { Person } from './entities/person.entity';
import { CommonModule } from 'src/common/common.module';

@Module({
  controllers: [PeopleController],
  providers: [PeopleService],
  imports: [
    AzureCosmosDbModule.forFeature([
      {dto: Person}
    ]),
    CommonModule
  ],
  exports: [AzureCosmosDbModule, AzureCosmosDbModule],
})
export class PeopleModule {}
