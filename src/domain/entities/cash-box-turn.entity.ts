import { CosmosDateTime, CosmosPartitionKey } from '@nestjs/azure-database';

@CosmosPartitionKey('cashBoxId')
export class CashBoxTurn {
    id?: string;
    cashBoxId: string;
    userId: string;
    initialMovementId: string;
    finalMovementId?: string;
    @CosmosDateTime() openAt: Date;
    @CosmosDateTime() closeAt?: Date;
    @CosmosDateTime() createdAt: Date;
    @CosmosDateTime() updatedAt?: Date;
    @CosmosDateTime() deletedAt?: Date;
}