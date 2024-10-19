import { Injectable } from '@nestjs/common';
import { Action } from 'src/domain/entities';

@Injectable()
export class ActionsService {
  findAll() {
    return Object.values(Action);
  }
}