import { InjectModel } from '@nestjs/azure-database';
import { Injectable } from '@nestjs/common';
import type { Container } from '@azure/cosmos';
import { ErrorEvent } from '../entities';
import { ApplicationLoggerService } from 'src/common/services/application-logger.service';
import { Repository } from './repository';

@Injectable()
export class ErrorEventsRepository extends Repository<ErrorEvent> {

    constructor(
        @InjectModel(ErrorEvent) container: Container,
        private readonly logger: ApplicationLoggerService,
    ) {
        super(container);
        this.logger.setContext(ErrorEventsRepository.name);
    }
}