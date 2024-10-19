import { Controller, Get } from '@nestjs/common';
import { ActionsService } from './actions.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Actions')
@Controller('actions')
export class ActionsController {
  constructor(private readonly actionsService: ActionsService) {}

  @ApiOperation({ summary: 'Get all actions' })
  @ApiResponse({ status: 200, description: 'Return all actions' })
  @Get()
  findAll() {
    return this.actionsService.findAll();
  }
}
