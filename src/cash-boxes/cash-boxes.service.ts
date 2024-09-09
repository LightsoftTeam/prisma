import { Injectable } from '@nestjs/common';
import { CreateCashBoxDto } from './dto/create-cash-box.dto';
import { UpdateCashBoxDto } from './dto/update-cash-box.dto';
import { CashBoxesRepository } from 'src/domain/repositories';
import { FindBySubsidiaryDto } from 'src/common/dto/find-by-sucursal.dto';
import { CashBox, CashBoxStatus } from 'src/domain/entities';
import { UsersService } from '../users/users.service';
import { ApplicationLoggerService } from 'src/common/services/application-logger.service';

@Injectable()
export class CashBoxesService {

  constructor(
    private readonly cashBoxesRepository: CashBoxesRepository,
    private readonly usersService: UsersService,
    private readonly logger: ApplicationLoggerService,
  ) {
    this.logger.setContext(CashBoxesService.name);
  }

  create(createCashBoxDto: CreateCashBoxDto) {
    const cashBox: CashBox = {
      ...createCashBoxDto,
      status: CashBoxStatus.CLOSED,
      createdById: this.usersService.getLoggedUser().id,
      createdAt: new Date(),
    }; 
    return this.cashBoxesRepository.create(cashBox);
  }

  findAll(findCashBoxesDto: FindBySubsidiaryDto) {
    const { subsidiaryId } = findCashBoxesDto;
    return this.cashBoxesRepository.findBySubsidiaryId(subsidiaryId);
  }

  update(id: string, updateCashBoxDto: UpdateCashBoxDto) {
    return this.cashBoxesRepository.update(id, updateCashBoxDto);
  }

  remove(id: string) {
    return this.cashBoxesRepository.delete(id, 'subsidiaryId');
  }
}
