import { InjectModel } from '@nestjs/azure-database';
import { Injectable } from '@nestjs/common';
import type { Container } from '@azure/cosmos';
import { CashBoxTurn } from '../entities';
import { ApplicationLoggerService } from 'src/common/services/application-logger.service';
import { Repository } from './repository';

@Injectable()
export class CashBoxTurnsRepository extends Repository<CashBoxTurn> {

    constructor(
        @InjectModel(CashBoxTurn) container: Container,
        private readonly logger: ApplicationLoggerService,
    ) {
        super(container);
        this.logger.setContext(CashBoxTurnsRepository.name);
    }

    async getCurrentTurn({ cashBoxId }: { cashBoxId: string }) {
        const querySpec = {
            query: `SELECT * FROM c WHERE c.cashBoxId = @cashBoxId AND NOT IS_DEFINED(c.finalMovementId) order by c.createdAt desc`,
            parameters: [
                { name: '@cashBoxId', value: cashBoxId },
            ],
        };
        const results = await super.find(querySpec);
        return results.at(0) ?? null;
    }
}