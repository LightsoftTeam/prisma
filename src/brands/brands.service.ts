import { Injectable, NotFoundException } from '@nestjs/common';
import type { Container } from '@azure/cosmos';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { InjectModel } from '@nestjs/azure-database';
import { Brand } from './entities/brand.entity';
import { ApplicationLoggerService } from 'src/common/services/application-logger.service';
import { FormatCosmosItem } from 'src/common/helpers/format-cosmos-item.helper';
import { FindBrandsDto } from './dto/find-brands.dto';

@Injectable()
export class BrandsService {

  constructor(
    @InjectModel(Brand)
    private readonly brandsContainer: Container,
    private readonly logger: ApplicationLoggerService,
  ) {
    this.logger.setContext(BrandsService.name);
  }


  async create(createBrandDto: CreateBrandDto) {
    this.logger.debug(`create brand - ${JSON.stringify(createBrandDto)}`);
    const newBrand = {
      ...createBrandDto,
      createdAt: new Date(),
    };
    const { resource } = await this.brandsContainer.items.create(newBrand);
    return FormatCosmosItem.cleanDocument(resource);
  }

  async findAll(findEnterprisesDto: FindBrandsDto) {
    const { enterpriseId } = findEnterprisesDto;
    const querySpec = {
      query: 'SELECT * FROM c where c.enterpriseId = @enterpriseId AND NOT IS_DEFINED(c.deletedAt) ORDER BY c.createdAt DESC',
      parameters: [
        {
          name: '@enterpriseId',
          value: enterpriseId
        }
      ],
    };
    const { resources } = await this.brandsContainer.items.query<Brand>(querySpec).fetchAll();
    return Promise.all(resources.map(brand => FormatCosmosItem.cleanDocument(brand)));
  }

  async getById(id: string): Promise<Brand | null> {
    try {
      const querySpec = {
        query: 'SELECT * FROM c WHERE c.id = @id',
        parameters: [
          {
            name: '@id',
            value: id,
          },
        ],
      };
      const { resources } = await this.brandsContainer.items.query<Brand>(querySpec).fetchAll();
      return resources.at(0) ?? null;
    } catch (error) {
      return null;
    }
  }

  async update(id: string, updateBrandDto: UpdateBrandDto) {
    const brand = await this.getById(id);
    if (!brand) {
      throw new NotFoundException('Brand not found');
    }
    const updatedBrand = {
      ...brand,
      ...updateBrandDto,
      updatedAt: new Date(),
    };
    const { resource } = await this.brandsContainer.item(id, brand.enterpriseId).replace(updatedBrand);
    return FormatCosmosItem.cleanDocument(resource);
  }

  async remove(id: string) {
    const brand = await this.getById(id);
    if (!brand) {
      throw new NotFoundException('Brand not found');
    }
    const deletedBrand = {
      ...brand,
      deletedAt: new Date(),
    };
    const { resource } = await this.brandsContainer.item(id, brand.enterpriseId).replace(deletedBrand);
    return null;
  }
}
