import { CosmosDateTime, CosmosPartitionKey } from '@nestjs/azure-database';

export enum RoleName{
    SUPER_ADMIN = 'super_admin',
    ADMIN = 'admin',
    CASHIER = 'cashier',
    WAREHOUSE_MANAGER = 'warehouse_manager',
    ACCOUNTANT = 'accountant',
}

export enum PermissionName{
    DASHBOARD = 'dashboard',
}

export interface Permission{
    id: string;
    module: Module;
    action: Action;
}

export enum Action{
    CREATE = 'create',
    READ = 'read',
    UPDATE = 'update',
    DELETE = 'delete',
}

export enum Module{
    DASHBOARD = 'dashboard',
    USERS = 'users',
    PRODUCTS = 'products',
    BRANDS = 'brands',
    UNITS = 'units',
    WAREHOUSES = 'warehouses',
    CASHBOXES = 'cashboxes',
    SUBSIDIARIES = 'subsidiaries',
    TPV = 'tpv',
    SALES = 'sales',
    CUSTOMERS = 'customers',
    PURCHASES = 'purchases',
    SUPPLIERS = 'suppliers',
    PAYMENT_CONCEPT = 'payment_concept',
    CASH_MOVEMENT = 'cash_movement',
}

@CosmosPartitionKey('id')
export class Role {
    id?: string;
    name: RoleName;
    permissions: Permission[];
    @CosmosDateTime() createdAt: Date;
}