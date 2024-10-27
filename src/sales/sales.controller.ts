import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, UseInterceptors, HttpCode, HttpStatus } from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
// import { UpdateSaleDto } from './dto/update-sale.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { GeneralInterceptor } from 'src/common/interceptors/general.interceptor';

@ApiTags('Sales')
@UseInterceptors(GeneralInterceptor)
@Controller('enterprises/:enterpriseId/subsidiaries/:subsidiaryId/sales')
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
  findAll() {
    return this.salesService.findAll();
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
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'The record has been successfully deleted.'})
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.salesService.remove(id);
  }
}
