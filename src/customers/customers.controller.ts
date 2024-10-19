import { Controller, Get, Post, Body, Param, Delete, Query, HttpCode, UseGuards, UseInterceptors } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { HttpStatusCode } from 'axios';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { GeneralInterceptor } from 'src/common/interceptors/general.interceptor';

@ApiTags('Customers')
@UseInterceptors(GeneralInterceptor)
@Controller('enterprises/:enterpriseId/subsidiaries/:subsidiaryId/customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @UseGuards(AuthGuard)
  @ApiResponse({ status: 201, description: 'The record has been successfully created.' })
  @Post()
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customersService.create(createCustomerDto);
  }

  @UseGuards(AuthGuard)
  @ApiResponse({ status: 200, description: 'The records has been successfully retrieved.' })
  @Get()
  findAll() {
    return this.customersService.findAll();
  }

  @UseGuards(AuthGuard)
  @ApiResponse({ status: 200, description: 'The record has been successfully retrieved.' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customersService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatusCode.NoContent)
  @ApiResponse({ status: 200, description: 'The record has been successfully updated.' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customersService.remove(id);
  }
}
