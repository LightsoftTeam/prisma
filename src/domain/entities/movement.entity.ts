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
    YAPE = 'yape',
    PLIN = 'plin',
    DEPOSIT = 'deposit',
    OTHERS = 'others',
}
export interface SaleData {
    customerId: string;
    total: number;
    items: SaleItem[];
    paymentItems: PaymentItem[];
}

export interface PaymentItem {
    id: string;
    paymentMethod: PaymentMethod;
    remarks?: string;
    amount: number;
}

export interface PurchaseData {
    supplierId: string;
    total: number;
    items: PurchaseItem[];
    transactionDocumentId: string;
    glosaId: string;
}

export interface CashBoxMovementData {
    // items: CashBoxMovementItem[];
    paymentConceptId: string;
    items: PaymentItem[];
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

// export interface CashBoxMovementItem {
//     id: string;
//     amount: number;
//     remarks?: string;
//     createdAt: Date;
//     updatedAt?: Date;
//     deletedAt?: Date;
// }

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