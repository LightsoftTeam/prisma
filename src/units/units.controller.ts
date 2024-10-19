import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors } from '@nestjs/common';
import { UnitsService } from './units.service';
// import { CreateUnitDto } from './dto/create-unit.dto';
// import { UpdateUnitDto } from './dto/update-unit.dto';
import { ApiTags } from '@nestjs/swagger';
import { GeneralInterceptor } from 'src/common/interceptors/general.interceptor';

@ApiTags('Units')
@Controller('enterprises/:enterpriseId/subsidiaries/:subsidiaryId/units')
@UseInterceptors(GeneralInterceptor)
export class UnitsController {
  constructor(private readonly unitsService: UnitsService) {}

  // @Post()
  // create(@Body() createUnitDto: CreateUnitDto) {
  //   return this.unitsService.create(createUnitDto);
  // }

  @Get()
  findAll() {
    return this.unitsService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.unitsService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUnitDto: UpdateUnitDto) {
  //   return this.unitsService.update(+id, updateUnitDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.unitsService.remove(+id);
  // }
}
