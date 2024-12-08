import { Module } from '@nestjs/common';
import { GlosasService } from './glosas.service';
import { GlosasController } from './glosas.controller';

@Module({
  controllers: [GlosasController],
  providers: [GlosasService],
})
export class GlosasModule {}
