import { CosmosDateTime, CosmosPartitionKey } from '@nestjs/azure-database';
import { Product } from './product.entity';

export enum MovementType {
    IN = 'IN',
    OUT = 'OUT',
    TRANSFER = 'TRANSFER',
    SALE = 'SALE',
    RETURN = 'RETURN',
    ADJUST = 'ADJUST',
    INVENTORY = 'INVENTORY',
    PURCHASE = 'PURCHASE',
}

export enum PaymentMethod{
    CASH = 'CASH',
    CREDIT = 'CREDIT',
    DEBIT = 'DEBIT',
    TRANSFER = 'TRANSFER'
}

export interface SaleData{
    customerId: string;
    paymentMethod: PaymentMethod;
    total: number;
}

export interface PurchaseData{
    supplierId: string;
    paymentMethod: PaymentMethod;
    total: number;
}

export interface Item {
    id: string;
    productId: string;
    quantity: number;
    salePrice: number;
    product?: Partial<Product>; 
}
@CosmosPartitionKey('subsidiaryId')
export class Movement {
    id?: string;
    type: MovementType;
    subsidiaryId: string;
    items: Item[];
    userId: string;
    data?: SaleData | PurchaseData;
    remarks?: string;
    @CosmosDateTime() createdAt: Date;
    @CosmosDateTime() updatedAt?: Date;
    @CosmosDateTime() deletedAt?: Date;
}