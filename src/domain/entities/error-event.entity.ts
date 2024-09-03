import { CosmosDateTime, CosmosPartitionKey } from '@nestjs/azure-database';

export enum ErrorEventType{
    CONCURRENCY_ERROR = 'concurrency_error',
    ATOMICITY_ERROR = 'atomicity_error',
    OPERATION_ERROR = 'operation_error',
}

@CosmosPartitionKey('code')
export class ErrorEvent {
    id?: string;
    code: ErrorEventType | number;
    message: string;
    payload?: {
        [key: string]: any;
    };
    stack?: string;
    @CosmosDateTime() createdAt: Date;
    @CosmosDateTime() updatedAt?: Date;
    @CosmosDateTime() deletedAt?: Date;
}