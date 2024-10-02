import { Injectable } from '@nestjs/common';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { Supplier } from '../domain/entities/supplier.entity';
import { ApplicationLoggerService } from 'src/common/services/application-logger.service';
import { PeopleService } from 'src/people/people.service';
import { FormatCosmosItem } from 'src/common/helpers/format-cosmos-item.helper';
import { FindByEnterpriseDto } from 'src/common/dto/find-by-enterprise.dto';
import { SuppliersRepository } from 'src/domain/repositories/suppliers.repository';
import { PeopleRepository } from 'src/domain/repositories/people.repository';

@Injectable()
export class SuppliersService {

  constructor(
    private readonly suppliersRepository: SuppliersRepository,
    private readonly logger: ApplicationLoggerService,
    private readonly peopleRepository: PeopleRepository,
  ) {
    this.logger.setContext(PeopleService.name);
  }

  async create(createSupplierDto: CreateSupplierDto) {
    this.logger.debug(`Creating supplier ${createSupplierDto}`);

    try {
      const { person: personDto, enterpriseId } = createSupplierDto;
      //TODO: check if person is already created
      const person = await this.peopleRepository.create({ ...personDto, createdAt: new Date() });
      const supplier: Supplier = {
        enterpriseId,
        personId: person.id,
        createdAt: new Date(),
      };
      const newSupplier = await this.suppliersRepository.create(supplier);
      return this.fill(newSupplier);
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  async findAll(findByEnterpriseDto: FindByEnterpriseDto) {
    const suppliers = await this.suppliersRepository.findByEnterpriseId(findByEnterpriseDto.enterpriseId);
    return Promise.all(suppliers.map(this.fill.bind(this)));
  }

  async remove(id: string) {
    return this.suppliersRepository.delete(id);
  }

  async fill(supplier: Supplier) {
    const person = await this.peopleRepository.findById(supplier.personId);
    return {
      ...FormatCosmosItem.cleanDocument<Supplier>(supplier),
      person: FormatCosmosItem.cleanDocument(person),
    }
  }
}