import { ObligatoryRoleName } from '../../../domain/entities/role.entity';

export function getRoles() {
    const roles = [
        {
            name: ObligatoryRoleName.SUPER_ADMIN,
            createdAt: new Date(),
            permissions: [],
        },
        {
            name: ObligatoryRoleName.ADMIN,
            createdAt: new Date(),
            permissions: [],
        },
        {
            name: ObligatoryRoleName.CASHIER,
            createdAt: new Date(),
            permissions: [],
        },
        {
            name: ObligatoryRoleName.WAREHOUSE_MANAGER,
            createdAt: new Date(),
            permissions: [],
        },
        {
            name: ObligatoryRoleName.ACCOUNTANT,
            createdAt: new Date(),
            permissions: [],
        }
    ];
    return roles;
}