import { Controller, Get, Query } from '@nestjs/common';
import { SubsidiariesService } from './subsidiaries.service';
import { ApiTags } from '@nestjs/swagger';
import { FindByEnterpriseDto } from 'src/common/dto/find-by-enterprise.dto';

@ApiTags('Subsidiaries')
@Controller('subsidiaries')
export class SubsidiariesController {
  constructor(private readonly subsidiariesService: SubsidiariesService) { }

  @Get()
  findAll(@Query() findSubsidiariesDto: FindByEnterpriseDto) {
    return this.subsidiariesService.findAll(findSubsidiariesDto);
  }
}
