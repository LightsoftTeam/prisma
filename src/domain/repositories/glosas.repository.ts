import { InjectModel } from '@nestjs/azure-database';
import { Injectable } from '@nestjs/common';
import type { Container } from '@azure/cosmos';
import { Glosa, GlosaType } from '../entities';
import { ApplicationLoggerService } from 'src/common/services/application-logger.service';
import { Repository } from './repository';

export interface Filters{
    type?: GlosaType;
    enterpriseId: string;
}

@Injectable()
export class GlosasRepository extends Repository<Glosa> {

    constructor(
        @InjectModel(Glosa) container: Container,
        private readonly logger: ApplicationLoggerService,
    ) {
        super(container);
        this.logger.setContext(GlosasRepository.name);
    }

    async findWithFilters(filters: Filters) {
        const { type } = filters;
        this.logger.debug('Finding all glosas');
        const querySpec = {
            query: `
                SELECT * FROM c
                Where NOT IS_DEFINED(c.deletedAt)
                AND (c.enterpriseId = @enterpriseId OR c.isInmutable = true)
            `,
            parameters: [
                {
                    name: '@type',
                    value: type,
                },
                {
                    name: '@enterpriseId',
                    value: filters.enterpriseId,
                }
            ],
        }
        if (type) {
            querySpec.query += ` AND c.type = @type`;
        }
        const { resources } = await this.container.items.query(querySpec).fetchAll();
        return resources;
    }
}