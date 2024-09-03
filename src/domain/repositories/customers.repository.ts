import { InjectModel } from '@nestjs/azure-database';
import { Injectable, NotFoundException } from '@nestjs/common';
import type { Container } from '@azure/cosmos';
import { Customer } from '../entities';
import { ApplicationLoggerService } from 'src/common/services/application-logger.service';
import { Repository } from './repository';
import { EnterprisesRepository } from './enterprises.repository';
import { PeopleRepository } from './people.repository';

@Injectable()
export class CustomersRepository extends Repository<Customer> {

    constructor(
        @InjectModel(Customer) container: Container,
        private readonly logger: ApplicationLoggerService,
        private readonly enterprisesRepository: EnterprisesRepository,
        private readonly peopleRepository: PeopleRepository,
    ) {
        super(container);
        this.logger.setContext(CustomersRepository.name);
    }

    async create(customer: Customer){
        await this.validate(customer);
        return super.create(customer);
    }

    private async validate(customer: Customer){
        const { enterpriseId, personId } = customer;
        const [enterprise, person] = await Promise.all([
            this.enterprisesRepository.findById(enterpriseId),
            this.peopleRepository.findById(personId),
        ]);
        if(!enterprise){
            throw new NotFoundException('Enterprise not found');
        }
        if(!person){
            throw new NotFoundException('Person not found');
        }
    }
}