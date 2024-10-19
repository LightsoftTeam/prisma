import { CosmosDateTime, CosmosPartitionKey } from '@nestjs/azure-database';
import { Person } from 'src/domain/entities/person.entity';

@CosmosPartitionKey('id')
export class User {
    id?: string;
    username: string;
    password: string;
    roleId: string;
    subsidiaryId: string;
    isActive: boolean;
    personId: string;
    person?: Person;
    @CosmosDateTime() createdAt: Date;
    @CosmosDateTime() updatedAt?: Date;
    @CosmosDateTime() deletedAt?: Date;
}