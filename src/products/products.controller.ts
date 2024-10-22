import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, UseInterceptors } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { HttpStatusCode } from 'axios';
import { GeneralInterceptor } from 'src/common/interceptors/general.interceptor';

@ApiTags('Products')
@Controller('enterprises/:enterpriseId/subsidiaries/:subsidiaryId/products')
@UseInterceptors(GeneralInterceptor)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'Get all products' })
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatusCode.NoContent)
  @ApiResponse({ status: HttpStatusCode.NoContent, description: 'Product deleted' })
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
