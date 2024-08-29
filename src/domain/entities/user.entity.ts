import { CosmosDateTime, CosmosPartitionKey } from '@nestjs/azure-database';
import { Person } from 'src/domain/entities/person.entity';
import { RoleName } from 'src/domain/entities/role.entity';

@CosmosPartitionKey('id')
export class User {
    id?: string;
    username: string;
    password: string;
    roleName: RoleName;
    subsidiaryId: string;
    isActive: boolean;
    personId: string;
    person?: Person;
    @CosmosDateTime() createdAt: Date;
    @CosmosDateTime() updatedAt?: Date;
    @CosmosDateTime() deletedAt?: Date;
}