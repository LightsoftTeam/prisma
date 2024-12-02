import { Controller, Get, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { readFile } from 'fs';
import { AppService } from './app.service';

@ApiTags('v1')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
  ) {}

  @Get('/swagger')
  getSwagger() {
    return new Promise((resolve, reject) => {
      readFile('swagger-spec.json', 'utf8', (err, data) => {
        if (err) {
          reject(err);
        }
        resolve(JSON.parse(data));
      });
    });
  }

  @Get('verify-user')
  verifyUser(@Query('email') email?: string) {
    return this.appService.verifyUser(email);
  }
}
