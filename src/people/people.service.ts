import { Injectable } from '@nestjs/common';
import { Person } from '../domain/entities/person.entity';
import { ApplicationLoggerService } from 'src/common/services/application-logger.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { PeopleRepository } from 'src/domain/repositories/people.repository';

@Injectable()
export class PeopleService {
    constructor(
        private readonly peopleRepository: PeopleRepository,
        private readonly logger: ApplicationLoggerService,
    ) {
        this.logger.setContext(PeopleService.name);
    }

    async findAll(){
        return this.peopleRepository.findAll();
    }

    async create(createPersonDto: CreatePersonDto): Promise<Person> {
        const newPerson: Person = {
            ...createPersonDto,
            createdAt: new Date(),
        };
        return this.peopleRepository.create(newPerson);
    }
}
