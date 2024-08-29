import { Body, Controller, Get, Post } from '@nestjs/common';
import { PeopleService } from './people.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePersonDto } from './dto/create-person.dto';

@ApiTags('People')
@Controller('people')
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
