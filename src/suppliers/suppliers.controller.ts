import { Controller, Get, Post, Body, Param, Delete, UseInterceptors, Patch, HttpCode } from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { GeneralInterceptor } from 'src/common/interceptors/general.interceptor';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { HttpStatusCode } from 'axios';

@ApiTags('Suppliers')
@UseInterceptors(GeneralInterceptor)
@Controller('enterprises/:enterpriseId/subsidiaries/:subsidiaryId/suppliers')
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  @ApiOperation({ summary: 'Create a supplier' })
  @ApiResponse({ status: HttpStatusCode.Created, description: 'The supplier has been successfully created.' })
  @Post()
  create(@Body() createSupplierDto: CreateSupplierDto) {
    return this.suppliersService.create(createSupplierDto);
  }

  @ApiOperation({ summary: 'Update a supplier' })
  @ApiResponse({ status: HttpStatusCode.Ok, description: 'The supplier has been successfully updated.' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSupplierDto: UpdateSupplierDto) {
    return this.suppliersService.update(id, updateSupplierDto);
  }

  @ApiOperation({ summary: 'Get all suppliers' })
  @ApiResponse({ status: HttpStatusCode.Ok, description: 'Return all suppliers.' })
  @Get()
  findAll() {
    return this.suppliersService.findAll();
  }

  @HttpCode(HttpStatusCode.NoContent)
  @ApiOperation({ summary: 'Remove a supplier' })
  @ApiResponse({ status: HttpStatusCode.NoContent, description: 'The supplier has been successfully removed.' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.suppliersService.remove(id);
  }
}
