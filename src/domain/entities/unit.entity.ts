import { CosmosDateTime, CosmosPartitionKey } from '@nestjs/azure-database';

@CosmosPartitionKey('id')
export class Unit {
    id?: string;
    description?: string;
    name: string;
    code: string;
    isActive: boolean;
    existsInSunat: boolean;
    @CosmosDateTime() createdAt: Date;
    @CosmosDateTime() updatedAt?: Date;
    @CosmosDateTime() deletedAt?: Date;
}