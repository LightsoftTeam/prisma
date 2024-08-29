import { Injectable } from '@nestjs/common';
import { CreateEnterpriseDto } from './dto/create-enterprise.dto';
import { UpdateEnterpriseDto } from './dto/update-enterprise.dto';
import { ApplicationLoggerService } from 'src/common/services/application-logger.service';
import { InjectModel } from '@nestjs/azure-database';
import { Enterprise } from './entities/enterprise.entity';
import type { Container } from '@azure/cosmos';

@Injectable()
export class EnterprisesService {

  constructor(
    private readonly logger: ApplicationLoggerService,
    @InjectModel(Enterprise)
    private readonly categoriesContainer: Container,
  ) {
    this.logger.setContext('EnterprisesService');
  }

  create(createEnterpriseDto: CreateEnterpriseDto) {
    return 'This action adds a new enterprise';
  }

  async findAll() {
    const { resources } = await this.categoriesContainer.items.readAll<Enterprise>().fetchAll();
    return resources;
  }

  findOne(id: string) {
    return `This action returns a ${id} enterprise`;
  }

  async getById(id: string) {
    try {
      this.logger.log(`Getting enterprise by id: ${id}`);
      const { resource } = await this.categoriesContainer.item(id, id).read<Enterprise>();
      return resource;
    } catch (error) {
      return null;
    }
  }

  update(id: number, updateEnterpriseDto: UpdateEnterpriseDto) {
    return `This action updates a #${id} enterprise`;
  }

  remove(id: number) {
    return `This action removes a #${id} enterprise`;
  }
}
