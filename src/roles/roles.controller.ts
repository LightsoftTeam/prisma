import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, UseInterceptors } from '@nestjs/common';
import { RolesService } from './roles.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AddPermissionDto } from './dto/add-permission.dto';
import { CreateRoleDto } from './dto/create-role.dto';
import { GeneralInterceptor } from 'src/common/interceptors/general.interceptor';
import { UpdateRoleDto } from './dto/update-role.dto';

@ApiTags('Roles')
@Controller('enterprises/:enterpriseId/subsidiaries/:subsidiaryId/roles')
@UseInterceptors(GeneralInterceptor)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @ApiResponse({ status: 200, description: 'Return all roles' })
  findAll() {
    return this.rolesService.findAll();
  } 

  @Post()
  @ApiResponse({ status: 201, description: 'Create a role' })
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  } 

  @Patch(':id')
  @ApiResponse({ status: 200, description: 'Update a role' })
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(id, updateRoleDto);
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

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({ status: HttpStatus.OK, description: 'Delete a role' })
  remove(@Param('id') id: string) {
    return this.rolesService.remove(id);
  }
}
