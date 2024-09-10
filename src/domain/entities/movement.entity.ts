import { CosmosDateTime, CosmosPartitionKey } from '@nestjs/azure-database';
import { CashFlowType } from './cash-box.entity';
import { Product } from './product.entity';

export enum MovementType {
    SALE = 'sale',
    PURCHASE = 'purchase',
    CASH_BOX = 'cash_box',
}

export enum PaymentMethod {
    CASH = 'cash',
    CREDIT = 'credit',
    DEBIT = 'debit',
    TRANSFER = 'transfer'
}

export interface SaleData {
    customerId: string;
    paymentMethod: PaymentMethod;
    total: number;
    items: SaleItem[];
}

export interface PurchaseData {
    supplierId: string;
    paymentMethod: PaymentMethod;
    total: number;
    items: PurchaseItem[];
}

export interface CashBoxMovementData {
    items: CashBoxMovementItem[];
    paymentConceptId: string;
    type: CashFlowType;
    total: number;
}

export interface SaleItem {
    id: string;
    productId: string;
    quantity: number;
    salePrice: number;
    product?: Partial<Product>;
}
export interface PurchaseItem {
    id: string;
    productId: string;
    quantity: number;
    purchasePrice: number;
    product?: Partial<Product>;
}

export interface CashBoxMovementItem {
    id: string;
    amount: number;
    remarks?: string;
    createdAt: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}

@CosmosPartitionKey('subsidiaryId')
export class Movement {
    id?: string;
    type: MovementType;
    subsidiaryId: string;
    createdById: string;
    data?: SaleData | PurchaseData | CashBoxMovementData;
    parentId?: string;
    remarks?: string;
    @CosmosDateTime() createdAt: Date;
    @CosmosDateTime() updatedAt?: Date;
    @CosmosDateTime() deletedAt?: Date;
}