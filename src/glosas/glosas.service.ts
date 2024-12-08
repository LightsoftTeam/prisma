import { BadRequestException, HttpCode, HttpStatus, Inject, Injectable, UseGuards } from '@nestjs/common';
import { CreateGlosaDto } from './dto/create-glosa.dto';
import { UpdateGlosaDto } from './dto/update-glosa.dto';
import { ApplicationLoggerService } from 'src/common/services/application-logger.service';
import { GlosasRepository } from '../domain/repositories/glosas.repository';
import { FindGlosasDto } from './dto/find-glosas.dto';
import { Glosa } from 'src/domain/entities';
import { ERROR_CODES, ERRORS } from 'src/common/constants/errors.constants';
import { REQUEST } from '@nestjs/core';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { ApiResponse } from '@nestjs/swagger';

@Injectable()
export class GlosasService {

  constructor(
    private readonly logger: ApplicationLoggerService,
    private readonly glosasRepository: GlosasRepository,
    @Inject(REQUEST) private readonly request: any,
  ) {}

  @UseGuards(AuthGuard)
  create(createGlosaDto: CreateGlosaDto) {
    const glosa: Glosa = {
      ...createGlosaDto,
      enterpriseId: this.request.enterpriseId,
      createdAt: new Date(),
    }
    return this.glosasRepository.create(glosa);
  }

  findAll(findGlosasDto: FindGlosasDto) {
    return this.glosasRepository.findWithFilters({
      ...findGlosasDto,
      enterpriseId: this.request.enterpriseId,
    });
  }

  async update(id: string, updateGlosaDto: UpdateGlosaDto) {
    const glosa = await this.glosasRepository.findById(id);
    if(glosa.isInmutable){
      throw new BadRequestException(ERRORS[ERROR_CODES.ITEM_IS_INMUTABLE]);
    }
    return this.glosasRepository.update(id, updateGlosaDto);
  }

  remove(id: string) {
    return this.glosasRepository.delete(id, 'enterpriseId');
  }
}
