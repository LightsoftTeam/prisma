import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { SubsidiariesRepository } from 'src/domain/repositories';
import { CreateSubsidiaryDto } from './dto/create-subsidiary.dto';
import { Subsidiary } from 'src/domain/entities';
import { UpdateSubsidiaryDto } from './dto/update-subsidiary.dto';

@Injectable()
export class SubsidiariesService {

  constructor(
    private readonly subsidiariesRepository: SubsidiariesRepository,
    @Inject(REQUEST) private readonly request: any,
  ) {}

  findAll() {
    return this.subsidiariesRepository.findByEnterpriseId(this.request.enterpriseId);
  }

  create(createSubsidiaryDto: CreateSubsidiaryDto) {
    const subsidiary: Subsidiary = {
      ...createSubsidiaryDto,
      enterpriseId: this.request.enterpriseId,
      createdAt: new Date(),
    }
    return this.subsidiariesRepository.create(subsidiary);
  }

  async update(id: string, updateSubsidiaryDto: UpdateSubsidiaryDto) {
    const subsidiary = await this.subsidiariesRepository.findById(id);
    if (!subsidiary) {
      throw new Error('Subsidiary not found');
    }
    const newSubsidiary: Subsidiary = {
      ...subsidiary,
      ...updateSubsidiaryDto,
      updatedAt: new Date(),
    }
    return this.subsidiariesRepository.update(id, newSubsidiary);
  }

  async remove(id: string) {
    this.subsidiariesRepository.delete(id);
    return null;
  }
}
