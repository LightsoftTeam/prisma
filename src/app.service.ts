import { Injectable } from '@nestjs/common';
import { BrandsRepository } from './domain/repositories';

@Injectable()
export class AppService {

  constructor(
    private readonly brandsRepository: BrandsRepository,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async testUpdateInBatch(){
    const brands = await this.brandsRepository.findAll();
    console.log(brands);
    brands.at(-1)['_etag'] = '123';
    return this.brandsRepository.updateInBatch(brands, { partitionKeyName: 'enterpriseId' });
  }
}
