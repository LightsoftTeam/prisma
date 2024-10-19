import { Injectable } from '@nestjs/common';
import { FormatCosmosItem } from 'src/common/helpers/format-cosmos-item.helper';
import { ApplicationLoggerService } from 'src/common/services/application-logger.service';
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
    const enterprises = await this.enterprisesRepository.findAll();
    return enterprises.map(enterprise => FormatCosmosItem.cleanDocument(enterprise, ['roleIds']));
  }
}
