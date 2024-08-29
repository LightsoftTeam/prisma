import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SubsidiariesService } from './subsidiaries.service';
import { CreateSubsidiaryDto } from './dto/create-subsidiary.dto';
import { UpdateSubsidiaryDto } from './dto/update-subsidiary.dto';

@Controller('subsidiaries')
export class SubsidiariesController {
  constructor(private readonly subsidiariesService: SubsidiariesService) {}

  @Post()
  create(@Body() createSubsidiaryDto: CreateSubsidiaryDto) {
    return this.subsidiariesService.create(createSubsidiaryDto);
  }

  @Get()
  findAll() {
    return this.subsidiariesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subsidiariesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSubsidiaryDto: UpdateSubsidiaryDto) {
    return this.subsidiariesService.update(+id, updateSubsidiaryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subsidiariesService.remove(+id);
  }
}
