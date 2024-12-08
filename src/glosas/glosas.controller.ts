import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { GlosasService } from './glosas.service';
import { CreateGlosaDto } from './dto/create-glosa.dto';
import { UpdateGlosaDto } from './dto/update-glosa.dto';
import { FindGlosasDto } from './dto/find-glosas.dto';
import { GeneralInterceptor } from 'src/common/interceptors/general.interceptor';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@ApiTags('Glosas')
@UseInterceptors(GeneralInterceptor)
@Controller('enterprises/:enterpriseId/subsidiaries/:subsidiaryId/glosas')
export class GlosasController {
  constructor(private readonly glosasService: GlosasService) {}

  @UseGuards(AuthGuard)
  @ApiResponse({ status: HttpStatus.OK, description: 'Glosa created' })
  @Post()
  create(@Body() createGlosaDto: CreateGlosaDto) {
    return this.glosasService.create(createGlosaDto);
  }

  @UseGuards(AuthGuard)
  @ApiResponse({ status: HttpStatus.OK, description: 'Glosas found' })
  @Get()
  findAll(@Query() findGlosasDto: FindGlosasDto) {
    return this.glosasService.findAll(findGlosasDto);
  }

  @UseGuards(AuthGuard)
  @ApiResponse({ status: HttpStatus.ACCEPTED, description: 'Glosa updated' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGlosaDto: UpdateGlosaDto) {
    return this.glosasService.update(id, updateGlosaDto);
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Glosa deleted' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.glosasService.remove(id);
  }
}
