import { Controller, Get, Post, Body, Param, Delete, UseInterceptors } from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { GeneralInterceptor } from 'src/common/interceptors/general.interceptor';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Suppliers')
@UseInterceptors(GeneralInterceptor)
@Controller('enterprises/:enterpriseId/subsidiaries/:subsidiaryId/suppliers')
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  @Post()
  create(@Body() createSupplierDto: CreateSupplierDto) {
    return this.suppliersService.create(createSupplierDto);
  }

  @Get()
  findAll() {
    return this.suppliersService.findAll();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.suppliersService.remove(id);
  }
}
