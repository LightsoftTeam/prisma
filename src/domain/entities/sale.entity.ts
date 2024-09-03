import { CosmosDateTime, CosmosPartitionKey } from '@nestjs/azure-database';
import { Product } from './product.entity';

export interface Item {
    id: string;
    productId: string;
    quantity: number;
    salePrice: number;
    product?: Partial<Product>; 
}
@CosmosPartitionKey('subsidiaryId')
export class Sale {
    id?: string;
    total: number;
    subsidiaryId: string;
    items: Item[];
    userId: string;
    @CosmosDateTime() createdAt: Date;
    @CosmosDateTime() updatedAt?: Date;
    @CosmosDateTime() deletedAt?: Date;
}