import { Body, Controller, Get, Post, UseInterceptors } from '@nestjs/common';
import { PeopleService } from './people.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePersonDto } from './dto/create-person.dto';
import { GeneralInterceptor } from 'src/common/interceptors/general.interceptor';

@ApiTags('People')
@UseInterceptors(GeneralInterceptor)
@Controller('enterprises/:enterpriseId/subsidiaries/:subsidiaryId/people')
export class PeopleController {
  constructor(private readonly peopleService: PeopleService) {}

  @ApiResponse({ status: 200, description: 'Get all people' })
  @Get()
  findAll() {
    return this.peopleService.findAll();
  }

  @ApiResponse({ status: 201, description: 'Create a new person' })
  @Post('create')
  create(@Body() createPersonDto: CreatePersonDto) {
    return this.peopleService.create(createPersonDto);
  }
}
