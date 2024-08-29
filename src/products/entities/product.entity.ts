import { CosmosDateTime, CosmosPartitionKey } from '@nestjs/azure-database';

@CosmosPartitionKey('enterpriseId')
export class Product {
    id?: string;
    enterpriseId: string;
    name: string;
    code: string;
    description?: string;
    salePrice: number;
    purchasePrice: number;
    stock: number;
    unitId: string;
    isActive: boolean;
    categoryId?: string;
    brandId?: string;
    image?: string;
    @CosmosDateTime() createdAt: Date;
    @CosmosDateTime() updatedAt?: Date;
    @CosmosDateTime() deletedAt?: Date;
}