import { InjectModel } from '@nestjs/azure-database';
import { Injectable, NotFoundException } from '@nestjs/common';
import type { Container } from '@azure/cosmos';
import { Supplier } from '../entities';
import { ApplicationLoggerService } from 'src/common/services/application-logger.service';
import { Repository } from './repository';
import { PeopleRepository } from './people.repository';
@Injectable()
export class SuppliersRepository extends Repository<Supplier> {
    constructor(
        @InjectModel(Supplier) container: Container,
        private readonly logger: ApplicationLoggerService,
        private readonly peopleRepository: PeopleRepository,
    ) {
        super(container);
        this.logger.setContext(SuppliersRepository.name);
    }

    async create(supplier: Supplier) {
        const person = await this.peopleRepository.findById(supplier.personId);
        if (!person) {
            throw new NotFoundException('Person not found');
        }
        return super.create(supplier);
    }

    async update(id: string, supplier: Partial<Supplier>) {
        if(supplier.personId){
            const person = await this.peopleRepository.findById(supplier.personId);
            if (!person) {
                throw new NotFoundException('Person not found');
            }
        }
        return super.update(id, supplier);
    }
}