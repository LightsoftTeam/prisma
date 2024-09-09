import { CosmosDateTime, CosmosPartitionKey } from '@nestjs/azure-database';

export enum CashBoxStatus {
    OPEN = 'open',
    CLOSED = 'closed',
}

export enum CashFlowType {
    INCOME = 'income',
    OUTCOME = 'outcome',
}

@CosmosPartitionKey('subsidiaryId')
export class CashBox {
    id?: string;
    subsidiaryId: string;
    name: string;
    status: CashBoxStatus;
    description?: string;
    createdById: string;
    responsableId: string;
    @CosmosDateTime() createdAt: Date;
    @CosmosDateTime() updatedAt?: Date;
    @CosmosDateTime() deletedAt?: Date;
}