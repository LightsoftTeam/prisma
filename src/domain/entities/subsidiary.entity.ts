import { CosmosDateTime, CosmosPartitionKey } from '@nestjs/azure-database';

@CosmosPartitionKey('enterpriseId')
export class Subsidiary {
    id?: string;
    name: string;
    address: string;
    ruc: string;
    image?: string;
    email?: string;
    phone?: string;
    enterpriseId: string;
    @CosmosDateTime() createdAt: Date;
    @CosmosDateTime() updatedAt?: Date;
    @CosmosDateTime() deletedAt?: Date;
}