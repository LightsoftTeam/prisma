import { CosmosDateTime, CosmosPartitionKey } from '@nestjs/azure-database';

@CosmosPartitionKey('subsidiaryId')
export class Kardex {
    id?: string;
    productId: string;
    quantity: number;
    movementId: string;
    subsidiaryId: string;
    remarks?: string;
    @CosmosDateTime() createdAt: Date;
    @CosmosDateTime() updatedAt?: Date;
    @CosmosDateTime() deletedAt?: Date;
}