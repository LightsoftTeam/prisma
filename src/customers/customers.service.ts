import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { CustomersRepository } from 'src/domain/repositories/customers.repository';
import { ApplicationLoggerService } from 'src/common/services/application-logger.service';
import { Customer } from 'src/domain/entities';
import { UsersService } from 'src/users/users.service';
import { PeopleRepository } from 'src/domain/repositories';
import { REQUEST } from '@nestjs/core';

@Injectable()
export class CustomersService {

  constructor(
    private readonly customersRepository: CustomersRepository,
    private readonly logger: ApplicationLoggerService,
    private readonly usersService: UsersService,
    private readonly peopleRepository: PeopleRepository,
    @Inject(REQUEST) private readonly request: any,
  ) {}

  async create(createCustomerDto: CreateCustomerDto) {
    this.logger.debug(`Creating customer ${createCustomerDto}`);
    try {
      const { person: personDto } = createCustomerDto;
      //TODO: check if person is already created
      const person = await this.peopleRepository.create({...personDto, createdAt: new Date()});
      const customer: Customer = {
        enterpriseId: this.request.enterpriseId,
        personId: person.id,
        userId: this.usersService.getLoggedUser().id,
        createdAt: new Date(),
      };
      const newCustomer = await this.customersRepository.create(customer);
      return this.fill(newCustomer);
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  async findAll() {
    const customers = await this.customersRepository.findByEnterpriseId(this.request.enterpriseId);
    return Promise.all(customers.map(customer => this.fill(customer)));
  }

  async findOne(id: string) {
    const customer = await this.customersRepository.findById(id);
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }
    return this.fill(customer);
  }

  remove(id: string) {
    return this.customersRepository.delete(id);
  }

  async fill(customer: Customer){
    const { personId } = customer;
    const person = await this.peopleRepository.findById(personId);
    return {
      ...customer,
      person,
    };
  }
}
