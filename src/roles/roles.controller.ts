import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { RolesService } from './roles.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AddPermissionDto } from './dto/add-permission.dto';

@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @ApiResponse({ status: 200, description: 'Return all roles' })
  findAll() {
    return this.rolesService.findAll();
  } 

  @Post(':id/permissions')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK, description: 'Add permission to role' })
  addPermission(@Param('id') roleId: string, @Body() addPermissionDto: AddPermissionDto) {
    return this.rolesService.addPermission(roleId, addPermissionDto);
  } 
  
  @Delete(':roleId/permissions/:permissionId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({ status: HttpStatus.OK, description: 'remove a permission' })
  removePermission(@Param('roleId') roleId: string, @Param('permissionId') permissionId: string) {
    return this.rolesService.removePermission(roleId, permissionId);
  } 
}
