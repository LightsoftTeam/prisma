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

@CosmosPartitionKey('id')
export class Role {
    id?: string;
    name: RoleName;
    permissions: PermissionName[];
    @CosmosDateTime() createdAt: Date;
}