import { Injectable } from '@nestjs/common';
import { CreateEnterpriseDto } from './dto/create-enterprise.dto';
import { UpdateEnterpriseDto } from './dto/update-enterprise.dto';
import { ApplicationLoggerService } from 'src/common/services/application-logger.service';
import { Enterprise } from '../domain/entities/enterprise.entity';
import { EnterprisesRepository } from 'src/domain/repositories/enterprises.repository';

@Injectable()
export class EnterprisesService {

  constructor(
    private readonly logger: ApplicationLoggerService,
    private readonly enterprisesRepository: EnterprisesRepository,
  ) {
    this.logger.setContext(EnterprisesService.name);
  }

  async findAll() {
    return this.enterprisesRepository.findAll();
  }
}
