import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpCode, Query, UseGuards } from '@nestjs/common';
import { CashBoxesService } from './cash-boxes.service';
import { CreateCashBoxDto } from './dto/create-cash-box.dto';
import { UpdateCashBoxDto } from './dto/update-cash-box.dto';
import { FindBySubsidiaryDto } from 'src/common/dto/find-by-sucursal.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@ApiTags('cash-boxes')
@Controller('cash-boxes')
export class CashBoxesController {
  constructor(private readonly cashBoxesService: CashBoxesService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createCashBoxDto: CreateCashBoxDto) {
    return this.cashBoxesService.create(createCashBoxDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll(@Query() findCashBoxesDto: FindBySubsidiaryDto) {
    return this.cashBoxesService.findAll(findCashBoxesDto);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCashBoxDto: UpdateCashBoxDto) {
    return this.cashBoxesService.update(id, updateCashBoxDto);
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cashBoxesService.remove(id);
  }
}
