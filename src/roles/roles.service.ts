import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ApplicationLoggerService } from 'src/common/services/application-logger.service';
import { Permission } from 'src/domain/entities';
import { RolesRepository } from 'src/domain/repositories/roles.repository';
import { AddPermissionDto } from './dto/add-permission.dto';
import { v4 as uuidv4 } from 'uuid';
import { ERROR_CODES, ERRORS } from 'src/common/constants/errors.constants';

@Injectable()
export class RolesService {
    constructor(
        private readonly rolesRepository: RolesRepository,
        private readonly logger: ApplicationLoggerService,
    ) {
        this.logger.setContext(RolesService.name);
    }

    async findAll() {
        const roles = await this.rolesRepository.findAll({
            orderBy: 'name',
            orderDirection: 'ASC',
        });
        return roles;
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
}
