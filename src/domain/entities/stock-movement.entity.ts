import { CosmosDateTime, CosmosPartitionKey } from '@nestjs/azure-database';

export enum Source{
    SALE = 'sale',
}

@CosmosPartitionKey('subsidiaryId')
export class StockMovement {
    id?: string;
    productId: string;
    quantity: number;
    source: Source;
    sourceId: string;
    subsidiaryId: string;
    remarks?: string;
    @CosmosDateTime() createdAt: Date;
    @CosmosDateTime() updatedAt?: Date;
    @CosmosDateTime() deletedAt?: Date;
}