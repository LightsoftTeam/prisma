import { CosmosDateTime, CosmosPartitionKey } from '@nestjs/azure-database';

export enum GlosaType{
    INCOME = 'income',
    EXPENSE = 'expense',
    CASH_BOX = 'cash_box',
    GUIDE = 'guide',
}

@CosmosPartitionKey('enterpriseId')
export class Glosa {
    id?: string;
    name: string;
    type: GlosaType;
    isInmutable?: boolean;
    description?: string;
    sunatCode?: string;
    enterpriseId?: string;
    @CosmosDateTime() createdAt: Date;
    @CosmosDateTime() updatedAt?: Date;
    @CosmosDateTime() deletedAt?: Date;
}

