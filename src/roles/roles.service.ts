import { BadRequestException, Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { ApplicationLoggerService } from 'src/common/services/application-logger.service';
import { Permission, Role } from 'src/domain/entities';
import { RolesRepository } from 'src/domain/repositories/roles.repository';
import { AddPermissionDto } from './dto/add-permission.dto';
import { v4 as uuidv4 } from 'uuid';
import { ERROR_CODES, ERRORS } from 'src/common/constants/errors.constants';
import { UsersRepository } from 'src/domain/repositories';
import { CreateRoleDto } from './dto/create-role.dto';
import { REQUEST } from '@nestjs/core';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable({ scope: Scope.REQUEST })
export class RolesService {
    constructor(
        @Inject(REQUEST) private readonly request: any,
        private readonly rolesRepository: RolesRepository,
        private readonly usersRepository: UsersRepository,
        private readonly logger: ApplicationLoggerService,
    ) {
        this.logger.setContext(RolesService.name);
    }

    async findAll() {
        const roles = await this.rolesRepository.findByEnterpriseId(this.request.enterpriseId);
        return roles;
    }

    async create(createRoleDto: CreateRoleDto) {
        const { name, permissions } = createRoleDto;
        const role: Role = {
            name,
            permissions: permissions?.map(p => ({
                id: uuidv4(),
                module: p.module,
                action: p.action,
            })) ?? [],
            enterpriseId: this.request.enterpriseId,
            createdAt: new Date(),
        }
        //TODO: revisar que no haya permisos duplicados
        return this.rolesRepository.create(role);
    }

    async update(id: string, updateRoleDto: UpdateRoleDto) {
        const role = await this.rolesRepository.findById(id);
        if(!role) {
            throw new NotFoundException('Role not found');
        }
        const { permissions, ...dto } = updateRoleDto;
        let newPermissions: Permission[] = role.permissions;
        if(permissions){
            newPermissions = permissions.map(p => {
                if(p.id){
                    return p as Permission;
                }
                return {
                    id: uuidv4(),
                    module: p.module,
                    action: p.action,
                }
            });
        }
        const updatedRole = {
            ...role,
            ...dto,
            permissions: newPermissions,
            updatedAt: new Date(),
        }
        //TODO: revisar que no haya permisos duplicados
        return this.rolesRepository.update(id, updatedRole);
    }

    async addPermission(roleId: string, addPermissionDto: AddPermissionDto) {
        const { action, module } = addPermissionDto;
        const role = await this.rolesRepository.findById(roleId);
        if(!role) {
            throw new NotFoundException('Role not found');
        }
        if(role.permissions.some(p => p.module === module && p.action === action)) {
            throw new BadRequestException(ERRORS[ERROR_CODES.PERMISSION_ALREADY_EXISTS]);
        }
        const permission: Permission = {
            id: uuidv4(),
            module,
            action
        };
        role.permissions.push(permission);
        this.rolesRepository.update(roleId, role);
        return permission;
    }
    
    async removePermission(roleId: string, permissionId: string) {
        const role = await this.rolesRepository.findById(roleId);
        if(!role) {
            throw new NotFoundException('Role not found');
        }
        role.permissions = role.permissions.filter(p => p.id !== permissionId);
        this.rolesRepository.update(roleId, role);
        return null;
    }

    async remove(id: string) {
        const usersCount = await this.usersRepository.findCountUsersByRoleId(id);
        if(usersCount > 0){
            throw new BadRequestException(ERRORS[ERROR_CODES.A_USER_HAS_THE_ROLE]);
        }
        this.rolesRepository.destroy(id);
        return null;
    }
}
