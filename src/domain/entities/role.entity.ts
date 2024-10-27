import { CosmosDateTime, CosmosPartitionKey } from '@nestjs/azure-database';

export enum ObligatoryRoleName{
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
    ASSIGN_PERMISSION = 'assign_permission',
    UNASSIGN_PERMISSION = 'unassign_permission',
    CHANGE_STATUS_CASHBOX = "change_status_cashbox"
}

export enum Module{
    DASHBOARD = 'dashboard',
    USERS = 'users',
    PRODUCTS = 'products',
    CATEGORIES = 'categories',
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
    ROLES = 'roles',
}

@CosmosPartitionKey('id')
export class Role {
    id?: string;
    name: string;
    permissions: Permission[];
    enterpriseId: string;
    isPermanent?: boolean;
    @CosmosDateTime() createdAt: Date;
}