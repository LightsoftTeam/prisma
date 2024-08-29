import { CosmosDateTime, CosmosPartitionKey } from "@nestjs/azure-database";

@CosmosPartitionKey('enterpriseId')
export class Category {
    id?: string;
    name: string;
    enterpriseId: string;
    parentId?: string;
    children?: Category[];
    @CosmosDateTime() createdAt: Date;
    @CosmosDateTime() updatedAt: Date;
    @CosmosDateTime() deletedAt?: Date;
}