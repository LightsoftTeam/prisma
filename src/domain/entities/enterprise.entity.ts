import { CosmosDateTime, CosmosPartitionKey } from '@nestjs/azure-database';

@CosmosPartitionKey('id')
export class Enterprise {
    id?: string;
    name: string;
    address: string;
    ruc: string;
    image?: string;
    email?: string;
    phone?: string;
    @CosmosDateTime() createdAt: Date;
    @CosmosDateTime() updatedAt?: Date;
}