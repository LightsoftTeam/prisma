import { Injectable } from '@nestjs/common';
import { ApplicationLoggerService } from 'src/common/services/application-logger.service';
import { UnitsRepository } from '../domain/repositories/units.repository';

@Injectable()
export class UnitsService {
  
  constructor(
    private readonly unitsRepository: UnitsRepository,
    private readonly logger: ApplicationLoggerService,
  ) {
    this.logger.setContext(UnitsService.name);
  }

  async findAll() {
    return this.unitsRepository.findAll();
  }
}
