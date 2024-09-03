import { CosmosDateTime, CosmosPartitionKey } from '@nestjs/azure-database';

@CosmosPartitionKey('enterpriseId')
export class Customer {
    id?: string;
    enterpriseId: string;
    personId: string;
    userId: string;
    @CosmosDateTime() createdAt: Date;
    @CosmosDateTime() updatedAt?: Date;
    @CosmosDateTime() deletedAt?: Date;
}