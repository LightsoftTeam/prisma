import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { ActionsService } from './actions.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GeneralInterceptor } from 'src/common/interceptors/general.interceptor';

@ApiTags('Actions')
@Controller('enterprises/:enterpriseId/subsidiaries/:subsidiaryId/actions')
@UseInterceptors(GeneralInterceptor)
export class ActionsController {
  constructor(private readonly actionsService: ActionsService) {}

  @ApiOperation({ summary: 'Get all actions' })
  @ApiResponse({ status: 200, description: 'Return all actions' })
  @Get()
  findAll() {
    return this.actionsService.findAll();
  }
}
