import { Injectable } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { ApplicationLoggerService } from 'src/common/services/application-logger.service';
import { BrandsRepository } from '../domain/repositories/brands.repository';
import { FindByEnterpriseDto } from 'src/common/dto/find-by-enterprise.dto';

@Injectable()
export class BrandsService {

  constructor(
    private readonly logger: ApplicationLoggerService,
    private readonly brandRepository: BrandsRepository,
  ) {
    this.logger.setContext(BrandsService.name);
  }

  async create(createBrandDto: CreateBrandDto) {
    return this.brandRepository.create({
      ...createBrandDto,
      createdAt: new Date(),
    });
  }

  async findAll({enterpriseId}: FindByEnterpriseDto) {
    return this.brandRepository.findByEnterpriseId(enterpriseId);
  }

  async update(id: string, updateBrandDto: UpdateBrandDto) {
    return this.brandRepository.update(id, updateBrandDto);
  }

  async remove(id: string) {
    return this.brandRepository.delete(id, 'enterpriseId');
  }
}
