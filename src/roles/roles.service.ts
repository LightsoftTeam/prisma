import { Injectable } from '@nestjs/common';
import { ApplicationLoggerService } from 'src/common/services/application-logger.service';
import { RolesRepository } from 'src/domain/repositories/roles.repository';

@Injectable()
export class RolesService {
    constructor(
        private readonly rolesRepository: RolesRepository,
        private readonly logger: ApplicationLoggerService,
    ) {
        this.logger.setContext(RolesService.name);
    }

    async findAll() {
        return this.rolesRepository.findAll({
            orderBy: 'name',
            orderDirection: 'ASC',
        });
    }
}
