import { Module } from '@nestjs/common';
import { EnterprisesService } from './enterprises.service';
import { EnterprisesController } from './enterprises.controller';
import { EnterprisesRepository } from 'src/domain/repositories';

@Module({
  controllers: [EnterprisesController],
  providers: [EnterprisesService, EnterprisesRepository],
})
export class EnterprisesModule {}
