import { Controller, Get, Post, Body, Param, Delete, Query, HttpCode, UseGuards, UseInterceptors, Patch, HttpStatus } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { GeneralInterceptor } from 'src/common/interceptors/general.interceptor';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@ApiTags('Customers')
@UseInterceptors(GeneralInterceptor)
@Controller('enterprises/:enterpriseId/subsidiaries/:subsidiaryId/customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Create a customer' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'The record has been successfully created.' })
  @Post()
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customersService.create(createCustomerDto);
  }

  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Update a customer' })
  @ApiResponse({ status: HttpStatus.OK, description: 'The customer has been updated.' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCustomerDto: UpdateCustomerDto) {
    return this.customersService.update(id, updateCustomerDto);
  }

  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get all customers' })
  @ApiResponse({ status: HttpStatus.OK, description: 'The records has been successfully retrieved.' })
  @Get()
  findAll() {
    return this.customersService.findAll();
  }

  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get a customer' })
  @ApiResponse({ status: HttpStatus.OK, description: 'The record has been successfully retrieved.' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customersService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({ status: 200, description: 'The record has been successfully updated.' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customersService.remove(id);
  }
}
