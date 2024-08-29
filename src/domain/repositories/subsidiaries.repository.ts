import { InjectModel } from '@nestjs/azure-database';
import { Injectable } from '@nestjs/common';
import type { Container } from '@azure/cosmos';
import { Subsidiary } from '../entities';
import { ApplicationLoggerService } from 'src/common/services/application-logger.service';
import { Repository } from './repository';
@Injectable()
export class SubsidiariesRepository extends Repository<Subsidiary> {
    constructor(
        @InjectModel(Subsidiary) container: Container,
        private readonly logger: ApplicationLoggerService,
    ) {
        super(container);
        this.logger.setContext(SubsidiariesRepository.name);
    }
}