import { CosmosDateTime, CosmosPartitionKey } from '@nestjs/azure-database';

@CosmosPartitionKey('level')
export class Ubigeo {
    id?: string;
    name: string;
    label: string;
    code: string;
    level: number;
    childrenCount: number;
    parentCode: string;
}