import { InjectModel } from '@nestjs/azure-database';
import { Injectable, NotFoundException } from '@nestjs/common';
import type { Container } from '@azure/cosmos';
import { Subsidiary } from '../entities';
import { ApplicationLoggerService } from 'src/common/services/application-logger.service';
import { Repository } from './repository';
import { EnterprisesRepository } from './enterprises.repository';
@Injectable()
export class SubsidiariesRepository extends Repository<Subsidiary> {
    constructor(
        @InjectModel(Subsidiary) container: Container,
        private readonly enterprisesRepository: EnterprisesRepository,
        private readonly logger: ApplicationLoggerService,
    ) {
        super(container);
        this.logger.setContext(SubsidiariesRepository.name);
    }

    private async validate(subsidiary: Subsidiary) {
        if (!await this.enterprisesRepository.findById(subsidiary.enterpriseId)) {
            this.logger.log(`Enterprise not found ${subsidiary.enterpriseId}`);
            throw new NotFoundException('Enterprise not found');
        }
    }
}