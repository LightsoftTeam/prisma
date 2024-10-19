import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Put, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { GeneralInterceptor } from 'src/common/interceptors/general.interceptor';

@ApiTags('Users')
@UseInterceptors(GeneralInterceptor)
@Controller('enterprises/:enterpriseId/subsidiaries/:subsidiaryId/users')
export class UsersController {
  constructor(private readonly userService: UsersService) { }

  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get users' })
  @ApiResponse({ status: 200, description: 'Return all users' })
  @Get()
  findAll(){
    return this.userService.findAll();
  }

  @UseGuards(AuthGuard)
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
  })
  @ApiOperation({ summary: 'Create a user' })
  @ApiResponse({ status: 201, description: 'Create a new user' })
  @ApiResponse({ status: 400, description: 'User already exists' })
  @Post()
  async create(@Body() createUserDto: CreateUserDto){
    return this.userService.create(createUserDto);
  }

  @UseGuards(AuthGuard)
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
  })
  @ApiOperation({ summary: 'Update a user' })
  @ApiResponse({ status: 200, description: 'User updated succesfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @Patch('/:id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto){
    return this.userService.update(id, updateUserDto);
  }

  @UseGuards(AuthGuard)
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete a user' })
  @ApiResponse({ status: 204, description: 'User deleted succesfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Delete('/:id')
  remove(@Param('id') id: string){
    return this.userService.remove(id);
  }
}
