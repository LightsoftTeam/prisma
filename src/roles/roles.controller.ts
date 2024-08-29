import { Controller, Get } from '@nestjs/common';
import { RolesService } from './roles.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @ApiResponse({ status: 200, description: 'Return all roles' })
  findAll() {
    return this.rolesService.findAll();
  } 
}
