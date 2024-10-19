import { Controller, Get } from '@nestjs/common';
import { ModulesService } from './modules.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Modules')
@Controller('modules')
export class ModulesController {
  constructor(private readonly modulesService: ModulesService) {}

  @ApiOperation({ summary: 'Get all modules' })
  @ApiResponse({ status: 200, description: 'Return all modules' })
  @Get()
  findAll() {
    return this.modulesService.findAll();
  }
}
