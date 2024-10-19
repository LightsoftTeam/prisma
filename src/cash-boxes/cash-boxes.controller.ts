import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpCode, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { CashBoxesService } from './cash-boxes.service';
import { CreateCashBoxDto } from './dto/create-cash-box.dto';
import { UpdateCashBoxDto } from './dto/update-cash-box.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { ChangeCashBoxStatusDto } from './dto/change-cash-box-status.dto';
import { GeneralInterceptor } from 'src/common/interceptors/general.interceptor';

@ApiTags('cash-boxes')
@UseInterceptors(GeneralInterceptor)
@Controller('enterprises/:enterpriseId/subsidiaries/:subsidiaryId/cash-boxes')
export class CashBoxesController {
  constructor(private readonly cashBoxesService: CashBoxesService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createCashBoxDto: CreateCashBoxDto) {
    return this.cashBoxesService.create(createCashBoxDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.cashBoxesService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cashBoxesService.findOne(id);
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

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post(':id/change-status')
  @ApiResponse({ status: 200, description: 'The cash box status has been changed successfully' })
  @ApiResponse({ status: 404, description: 'Cash box not found' })
  @ApiResponse({ status: 400, description: 'BadRequest' })
  changeCashBoxStatus(@Param('id') id: string, @Body() changeCashBoxStatusDto: ChangeCashBoxStatusDto) {
    return this.cashBoxesService.changeCashBoxStatus(id, changeCashBoxStatusDto);
  }
}
