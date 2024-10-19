import { Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import { SubsidiariesService } from './subsidiaries.service';
import { ApiTags } from '@nestjs/swagger';
import { GeneralInterceptor } from 'src/common/interceptors/general.interceptor';

@ApiTags('Subsidiaries')
@Controller('enterprises/:enterpriseId/subsidiaries')
@UseInterceptors(GeneralInterceptor)
export class SubsidiariesController {
  constructor(private readonly subsidiariesService: SubsidiariesService) { }

  @Get()
  findAll() {
    return this.subsidiariesService.findAll();
  }
}
