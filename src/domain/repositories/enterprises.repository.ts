import { InjectModel } from '@nestjs/azure-database';
import { Injectable } from '@nestjs/common';
import type { Container } from '@azure/cosmos';
import { Enterprise } from '../entities';
import { ApplicationLoggerService } from 'src/common/services/application-logger.service';
import { Repository } from './repository';

@Injectable()
export class EnterprisesRepository extends Repository<Enterprise> {

    constructor(
        @InjectModel(Enterprise) container: Container,
        private readonly logger: ApplicationLoggerService,
    ) {
        super(container);
        this.logger.setContext(EnterprisesRepository.name);
    }
}