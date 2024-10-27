import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { Supplier } from '../domain/entities/supplier.entity';
import { ApplicationLoggerService } from 'src/common/services/application-logger.service';
import { PeopleService } from 'src/people/people.service';
import { FormatCosmosItem } from 'src/common/helpers/format-cosmos-item.helper';
import { SuppliersRepository } from 'src/domain/repositories/suppliers.repository';
import { PeopleRepository } from 'src/domain/repositories/people.repository';
import { REQUEST } from '@nestjs/core';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { Person } from 'src/domain/entities';

@Injectable()
export class SuppliersService {

  constructor(
    private readonly suppliersRepository: SuppliersRepository,
    private readonly logger: ApplicationLoggerService,
    private readonly peopleRepository: PeopleRepository,
    @Inject(REQUEST) private readonly request: any,
  ) {
    this.logger.setContext(PeopleService.name);
  }

  async create(createSupplierDto: CreateSupplierDto) {
    this.logger.debug(`Creating supplier ${createSupplierDto}`);

    try {
      const { person: personDto } = createSupplierDto;
      //TODO: check if person is already created, handle error
      const person = await this.peopleRepository.create({ ...personDto, createdAt: new Date() });
      const supplier: Supplier = {
        enterpriseId: this.request.enterpriseId,
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

  async update(id: string, updateSupplierDto: UpdateSupplierDto) {
    try {
      const { person: personDto } = updateSupplierDto;
      //TODO: check if person is already created, handle error
      const supplier = await this.suppliersRepository.findById(id);
      if (!supplier) {
        throw new NotFoundException('Supplier not found');
      }
      const person = await this.peopleRepository.findById(supplier.personId);
      const updatedPerson: Person = {
        ...person,
        ...personDto,
        updatedAt: new Date(),
      };
      await this.peopleRepository.update(person.id, updatedPerson);
      return this.fill(supplier);
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  async findAll() {
    const suppliers = await this.suppliersRepository.findByEnterpriseId(this.request.enterpriseId);
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