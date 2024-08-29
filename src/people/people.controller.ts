import { Controller, Get } from '@nestjs/common';
import { PeopleService } from './people.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('People')
@Controller('people')
export class PeopleController {
  constructor(private readonly peopleService: PeopleService) {}

  @ApiResponse({ status: 200, description: 'Get all people' })
  @Get()
  findAll() {
    return this.peopleService.findAll();
  }
}
