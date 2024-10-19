import { BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateCashBoxDto } from './dto/create-cash-box.dto';
import { UpdateCashBoxDto } from './dto/update-cash-box.dto';
import { CashBoxesRepository, MovementsRepository, PaymentConceptsRepository, UsersRepository } from 'src/domain/repositories';
import { CashBox, CashBoxMovementData, CashBoxMovementItem, CashBoxStatus, CashBoxTurn, CashFlowType, Movement, MovementType } from 'src/domain/entities';
import { UsersService } from '../users/users.service';
import { ApplicationLoggerService } from 'src/common/services/application-logger.service';
import { ChangeCashBoxStatusDto } from './dto/change-cash-box-status.dto';
import { v4 as uuidv4 } from 'uuid';
import { ERROR_CODES, ERRORS } from 'src/common/constants/errors.constants';
import { CashBoxTurnsRepository } from 'src/domain/repositories/cash-box-turns.repository';
import { FormatCosmosItem } from 'src/common/helpers/format-cosmos-item.helper';
import { REQUEST } from '@nestjs/core';

@Injectable()
export class CashBoxesService {

  constructor(
    private readonly cashBoxesRepository: CashBoxesRepository,
    private readonly usersService: UsersService,
    private readonly logger: ApplicationLoggerService,
    private readonly movementsRepository: MovementsRepository,
    private readonly cashBoxTurnsRepository: CashBoxTurnsRepository,
    private readonly paymentConceptsRepository: PaymentConceptsRepository,
    private readonly usersRepository: UsersRepository,
    @Inject(REQUEST) private readonly request: any,
  ) {
    this.logger.setContext(CashBoxesService.name);
  }

  create(createCashBoxDto: CreateCashBoxDto) {
    const cashBox: CashBox = {
      ...createCashBoxDto,
      subsidiaryId: this.request.subsidiaryId,
      status: CashBoxStatus.CLOSED,
      createdById: this.usersService.getLoggedUser().id,
      createdAt: new Date(),
    };
    return this.cashBoxesRepository.create(cashBox);
  }

  async findAll() {
    const cashBoxes = await this.cashBoxesRepository.findBySubsidiaryId(this.request.subsidiaryId);
    return Promise.all(cashBoxes.map(cashBox => this.fill(cashBox)));
  }

  async findOne(id: string) {
    const cashBox = await this.cashBoxesRepository.findById(id);
    if (!cashBox) {
      throw new NotFoundException('Cash box not found');
    }
    return this.fill(cashBox);
  }

  async update(id: string, updateCashBoxDto: UpdateCashBoxDto) {
    const cashBox = await this.cashBoxesRepository.update(id, updateCashBoxDto);
    return this.fill(cashBox);
  }

  remove(id: string) {
    this.cashBoxesRepository.delete(id, 'subsidiaryId');
    return null;
  }

  async changeCashBoxStatus(id: string, changeCashBoxStatusDto: ChangeCashBoxStatusDto) {
    try {
      this.logger.log(`Changing cash box status`);
      const oldCashBox = await this.cashBoxesRepository.findById(id);
      if (!oldCashBox) {
        throw new NotFoundException('Cash box not found');
      }
      const { items: itemsDto, total, status, remarks } = changeCashBoxStatusDto;
      if (status === oldCashBox.status) {
        throw new BadRequestException('Cash box is already in the requested status');
      }
      let oldCashBoxTurn: CashBoxTurn | null = null;
      let newCashBox: CashBox;
      let newMovement: Movement;
      let newCashBoxTurn: CashBoxTurn;
      const loggedUser = this.usersService.getLoggedUser();
      const cashBoxPayload: CashBox = {
        ...oldCashBox,
        status,
        updatedAt: new Date(),
      };
      const now = new Date();
      const movementItems: CashBoxMovementItem[] = itemsDto.map(item => ({
        id: uuidv4(),
        ...item,
        createdAt: now,
      }));
      this.logger.debug('Validating items total');
      this.validateItemsTotal({ items: movementItems, total });
      const paymentConceptId = status === CashBoxStatus.OPEN ? this.paymentConceptsRepository.getCashBoxOpeningConceptId() : this.paymentConceptsRepository.getCashBoxClosingConceptId();
      const type = status === CashBoxStatus.OPEN ? CashFlowType.INCOME : CashFlowType.OUTCOME;
      const movementData: CashBoxMovementData = {
        items: movementItems,
        paymentConceptId,
        total,
        type,
      }
      const movementPayload: Movement = {
        data: movementData,
        remarks,
        type: MovementType.CASH_BOX,
        subsidiaryId: oldCashBox.subsidiaryId,
        createdById: loggedUser.id,
        createdAt: now,
      }
      this.logger.debug('Creating movement');
      newMovement = await this.movementsRepository.create(movementPayload);
      try {
        if (status === CashBoxStatus.OPEN) {
          const turn: CashBoxTurn = {
            cashBoxId: id,
            createdAt: now,
            initialMovementId: newMovement.id,
            userId: loggedUser.id,
            openAt: now,
          };
          this.logger.debug('Creating cash box turn');
          newCashBoxTurn = await this.cashBoxTurnsRepository.create(turn);
        } else {
          oldCashBoxTurn = await this.cashBoxTurnsRepository.getCurrentTurn({ cashBoxId: id });
          if (!oldCashBoxTurn) {
            throw new NotFoundException('Cash box turn not found');
          }
          const cashBoxTurnPayload: CashBoxTurn = {
            ...oldCashBoxTurn,
            finalMovementId: newMovement.id,
            closeAt: now,
            updatedAt: now
          };
          this.logger.debug('Updating cash box turn');
          newCashBoxTurn = await this.cashBoxTurnsRepository.update(cashBoxTurnPayload.id, cashBoxTurnPayload);
        }
      } catch (error) {
        this.logger.error(`Error creating or updating cash box turn: ${error.message}`);
        this.logger.debug('Reverting movement creation');
        await this.movementsRepository.destroy(newMovement.id, 'subsidiaryId');
        throw new InternalServerErrorException('Error creating cash box turn');
      }
      this.logger.debug('Updating cash box');
      try {
        newCashBox = await this.cashBoxesRepository.update(id, cashBoxPayload, {
          concurrencyRetryTimes: 3,
        });
      } catch (error) {
        this.logger.error(`Error changing state of cash box: ${error.message}`);
        this.logger.debug('Reverting movement creation');
        await this.movementsRepository.destroy(newMovement.id, 'subsidiaryId');
        this.logger.debug('Reverting cash box turn creation');
        await this.cashBoxTurnsRepository.destroy(newCashBoxTurn.id, 'cashBoxId');
        throw new InternalServerErrorException('Error updating cash box');
      }
      return this.fill(newCashBox);
    } catch (error) {
      this.logger.critical(`Error changing cash box status: ${error.message}`);
      throw error;
    }
  }

  private validateItemsTotal({ items, total }: { items: CashBoxMovementItem[], total: number }) {
    const itemsTotal = items.reduce((acc, item) => acc + item.amount, 0);
    if (itemsTotal !== total) {
      throw new BadRequestException(ERRORS[ERROR_CODES.TOTAL_INVALID]);
    }
  }

  private async fill(cashBox: CashBox) {
    const responsable = await this.usersRepository.findById(cashBox.responsableId);
    return {
      ...FormatCosmosItem.cleanDocument(cashBox),
      responsable: responsable ? FormatCosmosItem.cleanDocument(responsable, ['password']) : null,
    };
  }
}
