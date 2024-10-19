import { Injectable } from '@nestjs/common';
import { Module } from 'src/domain/entities';

@Injectable()
export class ModulesService {
  findAll() {
    return Object.values(Module);
  }
}
