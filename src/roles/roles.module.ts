import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { EnterprisesRepository, RolesRepository } from 'src/domain/repositories';

@Module({
  controllers: [RolesController],
  providers: [RolesService, RolesRepository, EnterprisesRepository],
})
export class RolesModule {}
