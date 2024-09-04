import { Controller, Get, Post } from '@nestjs/common';
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

  @Post('test-update-in-batch')
  testUpdateInBatch() {
    return this.appService.testUpdateInBatch();
  }
}
