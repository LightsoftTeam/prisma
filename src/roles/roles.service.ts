import { Injectable } from '@nestjs/common';
import { Role } from './entities/role.entity';
import type { Container } from '@azure/cosmos';
import { InjectModel } from '@nestjs/azure-database';
import { ApplicationLoggerService } from 'src/common/services/application-logger.service';
import { FormatCosmosItem } from 'src/common/helpers/format-cosmos-item.helper';

@Injectable()
export class RolesService {
    constructor(
        @InjectModel(Role)
        private readonly rolesContainer: Container,
        private readonly logger: ApplicationLoggerService,
    ) {
        this.logger.setContext(RolesService.name);
    }

    async findAll() {
        this.logger.log('findAll roles');
        const querySpec = {
            query: 'SELECT * FROM c ORDER BY c.name DESC',
            parameters: [],
        };
        const { resources } = await this.rolesContainer.items.query<Role>(querySpec).fetchAll();
        return resources.map(role => FormatCosmosItem.cleanDocument<Role>(role));
    }
}
