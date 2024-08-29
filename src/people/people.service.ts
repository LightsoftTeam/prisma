import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DocumentType, Person, PersonType } from './entities/person.entity';
import { InjectModel } from '@nestjs/azure-database';
import type { Container } from '@azure/cosmos';
import { ApplicationLoggerService } from 'src/common/services/application-logger.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { ERROR_CODES, ERRORS } from 'src/common/constants/errors.constants';
import { FormatCosmosItem } from 'src/common/helpers/format-cosmos-item.helper';

@Injectable()
export class PeopleService {
    constructor(
        @InjectModel(Person)
        private readonly peopleContainer: Container,
        private readonly logger: ApplicationLoggerService,
    ) {
        this.logger.setContext(PeopleService.name);
    }

    async findAll(){
        const { resources } = await this.peopleContainer.items.readAll<Person>().fetchAll();
        return resources;
    }

    async create(createPersonDto: CreatePersonDto): Promise<Person> {
        const {documentNumber, documentType, type} = createPersonDto;
        if(type === PersonType.JURIDICA && documentType !== DocumentType.RUC){
            throw new BadRequestException(ERRORS[ERROR_CODES.INVALID_DOCUMENT_TYPE]);
        }
        const existingPerson = await this.getByDocument({documentNumber, documentType});
        if(existingPerson){
            throw new BadRequestException(ERRORS[ERROR_CODES.PERSON_ALREADY_EXISTS]);
        }
        const newPerson: Person = {
            ...createPersonDto,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        const { resource } = await this.peopleContainer.items.create(newPerson);
        return resource;
    }

    async update(id: string, updatePersonDto: CreatePersonDto): Promise<Person> {
        const { type, documentType } = updatePersonDto;
        if(type === PersonType.JURIDICA && documentType !== DocumentType.RUC){
            throw new BadRequestException(ERRORS[ERROR_CODES.INVALID_DOCUMENT_TYPE]);
        }
        const person = await this.getById(id);
        if(!person){
            this.logger.log(`update person - Person not found`);
            throw new NotFoundException('Person not found');
        }
        const updatedPerson: Person = {
            ...person,
            ...updatePersonDto,
            updatedAt: new Date(),
        };
        const { resource } = await this.peopleContainer.item(id).replace(updatedPerson);
        return resource;
    }

    async getByDocument({documentType, documentNumber}: {documentType: string, documentNumber: string}): Promise<Person | null>{
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
        const { resources } = await this.peopleContainer.items.query<Person>(querySpec).fetchAll();
        return resources.at(0) ?? null;
    }

    async getById(id: string): Promise<Person | null> {
        try {
            const { resource } = await this.peopleContainer.item(id, id).read<Person>();
            return resource;
        } catch (error) {
            this.logger.error(`error getting person by id ${error.message}`);
            return null;
        }
    }
}
