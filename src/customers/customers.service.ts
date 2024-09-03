import { Injectable } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CustomersRepository } from 'src/domain/repositories/customers.repository';
import { ApplicationLoggerService } from 'src/common/services/application-logger.service';
import { Customer } from 'src/domain/entities';
import { FindByEnterpriseDto } from 'src/common/dto/find-by-enterprise.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class CustomersService {

  constructor(
    private readonly customersRepository: CustomersRepository,
    private readonly logger: ApplicationLoggerService,
    private readonly usersService: UsersService,
  ) {}

  create(createCustomerDto: CreateCustomerDto) {
    this.logger.debug('Creating customer');
    const loggedUser = this.usersService.getLoggedUser();
    const customer: Customer = {
      ...createCustomerDto,
      userId: loggedUser.id,
      createdAt: new Date(),
    };
    return this.customersRepository.create(customer);
  }

  findAll(findCustomersDto: FindByEnterpriseDto) {
    const { enterpriseId } = findCustomersDto;
    this.logger.debug(`Finding customers for enterprise ${enterpriseId}`);
    return this.customersRepository.findByEnterpriseId(enterpriseId);
  }

  findOne(id: string) {
    return this.customersRepository.findById(id);
  }

  remove(id: string) {
    return this.customersRepository.delete(id);
  }
}
