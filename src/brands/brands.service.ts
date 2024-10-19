import { Inject, Injectable } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { ApplicationLoggerService } from 'src/common/services/application-logger.service';
import { BrandsRepository } from '../domain/repositories/brands.repository';
import { REQUEST } from '@nestjs/core';

@Injectable()
export class BrandsService {

  constructor(
    private readonly logger: ApplicationLoggerService,
    private readonly brandRepository: BrandsRepository,
    @Inject(REQUEST) private readonly request: any,
  ) {
    this.logger.setContext(BrandsService.name);
  }

  async create(createBrandDto: CreateBrandDto) {
    return this.brandRepository.create({
      ...createBrandDto,
      enterpriseId: this.request.enterpriseId,
      createdAt: new Date(),
    });
  }

  async findAll() {
    return this.brandRepository.findByEnterpriseId(this.request.enterpriseId);
  }

  async update(id: string, updateBrandDto: UpdateBrandDto) {
    return this.brandRepository.update(id, updateBrandDto);
  }

  async remove(id: string) {
    return this.brandRepository.delete(id, 'enterpriseId');
  }
}
