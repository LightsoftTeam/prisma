import { Injectable } from '@nestjs/common';
import { FindByEnterpriseDto } from 'src/common/dto/find-by-enterprise.dto';
import { SubsidiariesRepository } from 'src/domain/repositories';

@Injectable()
export class SubsidiariesService {

  constructor(
    private readonly subsidiariesRepository: SubsidiariesRepository,
  ) {}

  findAll(findSubsidiariesDto: FindByEnterpriseDto) {
    return this.subsidiariesRepository.findByEnterpriseId(findSubsidiariesDto.enterpriseId);
  }
}
