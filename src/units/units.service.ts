import { Injectable } from '@nestjs/common';
import type { Container } from '@azure/cosmos';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { InjectModel } from '@nestjs/azure-database';
import { Unit } from './entities/unit.entity';
import { FormatCosmosItem } from 'src/common/helpers/format-cosmos-item.helper';
import { ApplicationLoggerService } from 'src/common/services/application-logger.service';

@Injectable()
export class UnitsService {
  
  constructor(
    @InjectModel(Unit)
    private readonly unitsContainer: Container,
    private readonly logger: ApplicationLoggerService,
  ) {
    this.logger.setContext(UnitsService.name);
  }

  create(createUnitDto: CreateUnitDto) {
    return 'This action adds a new unit';
  }

  async findAll() {
    this.logger.log('findAll units');
    const querySpec = {
      query: 'SELECT * from c where NOT IS_DEFINED(c.deletedAt) ORDER BY c.createdAt DESC',
    }
    const { resources } = await this.unitsContainer.items.query<Unit>(querySpec).fetchAll();
    return resources.map(unit => FormatCosmosItem.cleanDocument(unit));
  }

  findOne(id: number) {
    return `This action returns a #${id} unit`;
  }

  async getById(id: string){
    try {
      this.logger.log(`Getting unit by id: ${id}`);
      const { resource } = await this.unitsContainer.item(id, id).read<Unit>();
      return resource;
    } catch (error) {
      return null;
    }
  }

  update(id: number, updateUnitDto: UpdateUnitDto) {
    return `This action updates a #${id} unit`;
  }

  remove(id: number) {
    return `This action removes a #${id} unit`;
  }
}
