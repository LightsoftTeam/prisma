import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { ModulesService } from './modules.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GeneralInterceptor } from 'src/common/interceptors/general.interceptor';

@ApiTags('Modules')
@Controller('enterprises/:enterpriseId/subsidiaries/:subsidiaryId/modules')
@UseInterceptors(GeneralInterceptor)
export class ModulesController {
  constructor(private readonly modulesService: ModulesService) {}

  @ApiOperation({ summary: 'Get all modules' })
  @ApiResponse({ status: 200, description: 'Return all modules' })
  @Get()
  findAll() {
    return this.modulesService.findAll();
  }
}
