import { CosmosDateTime, CosmosPartitionKey } from '@nestjs/azure-database';

export enum KardexFlowType {
    INCOME = 'income',
    OUTCOME = 'outcome',
}

@CosmosPartitionKey('subsidiaryId')
export class Kardex {
    id?: string;
    productId: string;
    quantity: number;
    movementId: string;
    subsidiaryId: string;
    flowType: KardexFlowType;
    remarks?: string;
    @CosmosDateTime() createdAt: Date;
    @CosmosDateTime() updatedAt?: Date;
    @CosmosDateTime() deletedAt?: Date;
}