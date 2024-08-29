import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { AzureCosmosDbModule } from '@nestjs/azure-database';
import { Role } from './entities/role.entity';
import { CommonModule } from 'src/common/common.module';

@Module({
  controllers: [RolesController],
  providers: [RolesService],
  imports: [
    AzureCosmosDbModule.forFeature([
      {dto: Role}
    ]),
    CommonModule
  ],
  exports: [AzureCosmosDbModule],
})
export class RolesModule {}
