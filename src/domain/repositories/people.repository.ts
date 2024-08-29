import { InjectModel } from '@nestjs/azure-database';
import { BadRequestException, Injectable } from '@nestjs/common';
import type { Container } from '@azure/cosmos';
import { DocumentType, Person, PersonType } from '../entities';
import { ApplicationLoggerService } from 'src/common/services/application-logger.service';
import { Repository } from './repository';
import { ERROR_CODES, ERRORS } from 'src/common/constants/errors.constants';
@Injectable()
export class PeopleRepository extends Repository<Person> {
    constructor(
        @InjectModel(Person) container: Container,
        private readonly logger: ApplicationLoggerService,
    ) {
        super(container);
        this.logger.setContext(PeopleRepository.name);
    }

    async create(person: Person){
        const {documentNumber, documentType, type} = person;
        if(type === PersonType.JURIDICA && documentType !== DocumentType.RUC){
            throw new BadRequestException(ERRORS[ERROR_CODES.INVALID_DOCUMENT_TYPE]);
        }
        const existingPerson = await this.findByDocument({documentNumber, documentType});
        if(existingPerson){
            throw new BadRequestException(ERRORS[ERROR_CODES.PERSON_ALREADY_EXISTS]);
        }
        return super.create(person);
    }

    async update(id: string, person: Partial<Person>){
        const { type, documentType } = person;
        if(type === PersonType.JURIDICA && documentType !== DocumentType.RUC){
            throw new BadRequestException(ERRORS[ERROR_CODES.INVALID_DOCUMENT_TYPE]);
        }
        return super.update(id, person);
    }

    async findByDocument({documentType, documentNumber}: {documentType: DocumentType, documentNumber: string}): Promise<Person | null> {
        const querySpec = {
            query: 'SELECT * FROM c WHERE c.documentType = @documentType AND c.documentNumber = @documentNumber',
            parameters: [
                {
                    name: '@documentType',
                    value: documentType,
                },
                {
                    name: '@documentNumber',
                    value: documentNumber,
                },
            ],
        };
        const resources = await this.find(querySpec);
        return resources.at(0) ?? null;
    }
}