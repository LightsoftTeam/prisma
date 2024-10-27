import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UseGuards, HttpStatus, HttpCode } from '@nestjs/common';
import { PurchasesService } from './purchases.service';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { UpdatePurchaseDto } from './dto/update-purchase.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GeneralInterceptor } from 'src/common/interceptors/general.interceptor';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@ApiTags('Purchases')
@UseInterceptors(GeneralInterceptor)
@Controller('enterprises/:enterpriseId/subsidiaries/:subsidiaryId/purchases')
export class PurchasesController {
  constructor(private readonly purchasesService: PurchasesService) {}

  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Create a purchase' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'The purchase has been successfully created.' })
  @Post()
  create(@Body() createPurchaseDto: CreatePurchaseDto) {
    return this.purchasesService.create(createPurchaseDto);
  }

  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get all purchases' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return all purchases.' })
  @Get()
  findAll() {
    return this.purchasesService.findAll();
  }

  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get a purchase by id' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return a purchase by id.' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.purchasesService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Update a purchase by id' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return the updated purchase.' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePurchaseDto: UpdatePurchaseDto) {
    return this.purchasesService.update(id, updatePurchaseDto);
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a purchase by id' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Return the deleted purchase.' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.purchasesService.remove(id);
  }
}
