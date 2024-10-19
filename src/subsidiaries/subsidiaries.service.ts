import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { SubsidiariesRepository } from 'src/domain/repositories';

@Injectable()
export class SubsidiariesService {

  constructor(
    private readonly subsidiariesRepository: SubsidiariesRepository,
    @Inject(REQUEST) private readonly request: any,
  ) {}

  findAll() {
    return this.subsidiariesRepository.findByEnterpriseId(this.request.enterpriseId);
  }
}
