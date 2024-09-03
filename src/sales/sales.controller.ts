import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
// import { UpdateSaleDto } from './dto/update-sale.dto';
import { FindByEnterpriseDto } from 'src/common/dto/find-by-enterprise.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@ApiTags('Sales')
@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @UseGuards(AuthGuard)
  @ApiResponse({ status: 201, description: 'The record has been successfully created.'})
  @Post()
  create(@Body() createSaleDto: CreateSaleDto) {
    return this.salesService.create(createSaleDto);
  }

  @UseGuards(AuthGuard)
  @ApiResponse({ status: 200, description: 'The records has been successfully retrieved.'})
  @Get()
  findAll(@Query() findSalesDto: FindByEnterpriseDto) {
    return this.salesService.findAll(findSalesDto);
  }

  @UseGuards(AuthGuard)
  @ApiResponse({ status: 200, description: 'The record has been successfully retrieved.'}) 
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.salesService.findOne(id);
  }

  // @ApiResponse({ status: 200, description: 'The record has been successfully updated.'})
  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateSaleDto: UpdateSaleDto) {
  //   return this.salesService.update(+id, updateSaleDto);
  // }

  @UseGuards(AuthGuard)
  @ApiResponse({ status: 200, description: 'The record has been successfully deleted.'})
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.salesService.remove(id);
  }
}
