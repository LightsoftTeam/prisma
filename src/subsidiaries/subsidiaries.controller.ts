import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { SubsidiariesService } from './subsidiaries.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GeneralInterceptor } from 'src/common/interceptors/general.interceptor';
import { CreateSubsidiaryDto } from './dto/create-subsidiary.dto';
import { UpdateSubsidiaryDto } from './dto/update-subsidiary.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@ApiTags('Subsidiaries')
@Controller('enterprises/:enterpriseId/subsidiaries')
@UseInterceptors(GeneralInterceptor)
export class SubsidiariesController {
  constructor(private readonly subsidiariesService: SubsidiariesService) { }

  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get all subsidiaries' })
  @ApiResponse({ status: 200, description: 'Return all subsidiaries' })
  @Get()
  findAll() {
    return this.subsidiariesService.findAll();
  }

  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Create a subsidiary' })
  @ApiResponse({ status: 201, description: 'Create a subsidiary' })
  @Post()
  create(@Body() createSubsidiaryDto: CreateSubsidiaryDto) {
    return this.subsidiariesService.create(createSubsidiaryDto);
  }

  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Update a subsidiary' })
  @ApiResponse({ status: 200, description: 'Update a subsidiary' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSubsidiaryDto: UpdateSubsidiaryDto) {
    return this.subsidiariesService.update(id, updateSubsidiaryDto);
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a subsidiary' })
  @ApiResponse({ status: 200, description: 'Delete a subsidiary' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subsidiariesService.remove(id);
  }
}
