import { RoleName } from '../../../roles/entities/role.entity';

export function getRoles() {
    const roles = [
        {
            name: RoleName.SUPER_ADMIN,
            createdAt: new Date(),
            permissions: [],
        },
        {
            name: RoleName.ADMIN,
            createdAt: new Date(),
            permissions: [],
        },
        {
            name: RoleName.CASHIER,
            createdAt: new Date(),
            permissions: [],
        },
        {
            name: RoleName.WAREHOUSE_MANAGER,
            createdAt: new Date(),
            permissions: [],
        },
        {
            name: RoleName.ACCOUNTANT,
            createdAt: new Date(),
            permissions: [],
        }
    ];
    return roles;
}