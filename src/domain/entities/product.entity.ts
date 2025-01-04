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
    unitId: string;
    isActive: boolean;
    image?: string;
    categoryId?: string;
    brandId?: string;
    @CosmosDateTime() createdAt: Date;
    @CosmosDateTime() updatedAt?: Date;
    @CosmosDateTime() deletedAt?: Date;
}

export const PRODUCT_BASIC_FIELDS = ['id', 'name', 'code', 'salePrice', 'purchasePrice', 'image'];