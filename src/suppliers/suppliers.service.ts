import { Injectable, NotFoundException } from '@nestjs/common';
import type { Container } from '@azure/cosmos';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { InjectModel } from '@nestjs/azure-database';
import { Supplier } from './entities/supplier.entity';
import { ApplicationLoggerService } from 'src/common/services/application-logger.service';
import { PeopleService } from 'src/people/people.service';
import { FormatCosmosItem } from 'src/common/helpers/format-cosmos-item.helper';
import { EnterprisesService } from 'src/enterprises/enterprises.service';
import { FindByEnterpriseDto } from 'src/common/dto/find-by-enterprise.dto';

@Injectable()
export class SuppliersService {

  constructor(
    @InjectModel(Supplier)
    private readonly supplierContainer: Container,
    private readonly logger: ApplicationLoggerService,
    private readonly peopleService: PeopleService,
    private readonly enterpriseService: EnterprisesService,
  ) {
    this.logger.setContext(PeopleService.name);
  }

  async create(createSupplierDto: CreateSupplierDto) {
    const { personId } = createSupplierDto;
    const person = await this.peopleService.getById(personId);
    if (!person) {
      this.logger.log(`create supplier - Person not found`);
      throw new NotFoundException('Person not found');
    }
    const newSupplier: Supplier = {
      ...createSupplierDto,
      createdAt: new Date(),
    };
    const { resource } = await this.supplierContainer.items.create(newSupplier);
    return FormatCosmosItem.cleanDocument<Supplier>(resource);
  }

  async findAll(findByEnterpriseDto: FindByEnterpriseDto) {
    const { enterpriseId } = findByEnterpriseDto;
    const querySpec = {
      query: 'SELECT * FROM c WHERE c.enterpriseId = @enterpriseId AND NOT IS_DEFINED(c.deletedAt)',
      parameters: [
        {
          name: '@enterpriseId',
          value: enterpriseId,
        },
      ]
    }
    const { resources } = await this.supplierContainer.items.query<Supplier>(querySpec).fetchAll();
    return Promise.all(resources.map(this.fill.bind(this)));
  }

  async getById(id: string) {
    try {
      this.logger.log(`get supplier by id - id: ${id}`);
      const querySpec = {
        query: 'SELECT * FROM c WHERE c.id = @id',
        parameters: [
          {
            name: '@id',
            value: id,
          }
        ]
      };
      const { resources } = await this.supplierContainer.items.query<Supplier>(querySpec).fetchAll();
      return resources.at(0) ?? null;
    } catch (error) {
      this.logger.log(`get supplier by id - Supplier not found`);
      return null;
    }
  }

  async remove(id: string) {
    try {
      const supplier = await this.getById(id);
      if (!supplier) {
        this.logger.log(`remove supplier - Supplier not found`);
        throw new NotFoundException('Supplier not found');
      }
      const supplierUpdated: Supplier = {
        ...supplier,
        deletedAt: new Date(),
      };
      await this.supplierContainer.item(id).replace(supplierUpdated);
      return null;
    } catch (error) {
      this.logger.log(`remove supplier - error`);
      this.logger.error(error.message);
      throw error;
    }
  }

  async fill(supplier: Supplier) {
    const person = await this.peopleService.getById(supplier.personId);
    return {
      ...FormatCosmosItem.cleanDocument<Supplier>(supplier),
      person,
    }
  }
}
