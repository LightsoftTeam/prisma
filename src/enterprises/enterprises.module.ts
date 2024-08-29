import { Module } from '@nestjs/common';
import { EnterprisesService } from './enterprises.service';
import { EnterprisesController } from './enterprises.controller';
import { AzureCosmosDbModule } from '@nestjs/azure-database';
import { Enterprise } from './entities/enterprise.entity';
import { CommonModule } from 'src/common/common.module';

@Module({
  controllers: [EnterprisesController],
  providers: [EnterprisesService],
  imports: [
    AzureCosmosDbModule.forFeature([
      {dto: Enterprise}
    ]),
    CommonModule,
  ],
  exports: [AzureCosmosDbModule],
})
export class EnterprisesModule {}
