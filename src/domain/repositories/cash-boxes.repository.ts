import { InjectModel } from '@nestjs/azure-database';
import { Injectable } from '@nestjs/common';
import type { Container } from '@azure/cosmos';
import { CashBox } from '../entities';
import { ApplicationLoggerService } from 'src/common/services/application-logger.service';
import { Repository } from './repository';

@Injectable()
export class CashBoxesRepository extends Repository<CashBox> {

    constructor(
        @InjectModel(CashBox) container: Container,
        private readonly logger: ApplicationLoggerService,
    ) {
        super(container);
        this.logger.setContext(CashBoxesRepository.name);
    }
}