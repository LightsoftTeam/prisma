import { BadRequestException, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { ApplicationLoggerService } from 'src/common/services/application-logger.service';
import { ErrorEventsRepository, MovementsRepository, PaymentConceptsRepository, ProductsRepository } from 'src/domain/repositories';
import { REQUEST } from '@nestjs/core';
import { UsersService } from 'src/users/users.service';
import { CashBoxMovementData, CashFlowType, Movement, MovementType, PaymentItem, PRODUCT_BASIC_FIELDS, PurchaseData } from 'src/domain/entities';
import { v4 as uuidv4 } from 'uuid';
import { ERROR_CODES, ERRORS } from 'src/common/constants/errors.constants';
import { ErrorEvent } from 'src/domain/errors/error-event.error';
import { UpdatePurchaseDto } from './dto/update-purchase.dto';

@Injectable()
export class PurchasesService {
  constructor(
    private readonly logger: ApplicationLoggerService,
    private readonly productsRepository: ProductsRepository,
    private readonly errorEventsRepository: ErrorEventsRepository,
    private readonly usersService: UsersService,
    private readonly movementsRepository: MovementsRepository,
    private readonly paymentConceptsRepository: PaymentConceptsRepository,
    @Inject(REQUEST) private readonly request: any,
  ) {
    this.logger.setContext(PurchasesService.name);
  }

  async create(createPurchaseDto: CreatePurchaseDto) {
    try {
      this.logger.debug('Creating sale');
      const { items, total, paymentItems: paymentItemsDto, supplierId, generateCashFlow, transactionDocumentId, glosaId, ...movementData } = createPurchaseDto;
      if(generateCashFlow && paymentItemsDto.length === 0) {
        throw new BadRequestException(ERRORS[ERROR_CODES.PAYMENT_ITEMS_REQUIRED]);
      }
      const loggedUser = this.usersService.getLoggedUser();
      //TODO: Validate if supplier exists, validate if products exists, validate if transaction document exists, validate if glosa exists
      const data: PurchaseData = {
        supplierId,
        items: items.map(item => ({
          ...item,
          id: uuidv4()
        })),
        total,
        transactionDocumentId,
        glosaId,
      }
      const movement: Movement = {
        ...movementData,
        subsidiaryId: this.request.subsidiaryId,
        type: MovementType.PURCHASE,
        createdById: loggedUser.id,
        data,
        createdAt: new Date(),
      };
      const paymentItems = paymentItemsDto.map(item => ({
        ...item,
        id: uuidv4(),
        createdAt: new Date(),
      }));
      this.validateTotal({movement, paymentItems, generateCashFlow});
      this.logger.debug(`Creating movement - ${movement.type}`);
      const newMovement = await this.movementsRepository.create(movement);
      if(generateCashFlow) {
        try {
          const cashBoxMovementData: CashBoxMovementData = {
            type: CashFlowType.OUTCOME,
            items: paymentItems,
            paymentConceptId: this.paymentConceptsRepository.getPurchaseConceptId(),
            total,
          }
          const cashBoxMovementPayload: Movement = {
            type: MovementType.CASH_BOX,
            subsidiaryId: this.request.subsidiaryId,
            createdAt: new Date(),
            createdById: loggedUser.id,
            data: cashBoxMovementData,
          }
          this.logger.debug('Creating cash box movement');
          await this.movementsRepository.create(cashBoxMovementPayload);
        } catch (error) {
          this.movementsRepository.delete(newMovement.id);
          throw error;
        }
      }
      return newMovement;
    } catch (error) {
      this.logger.critical(`Error creating purchase ${error.message}`);
      if (error instanceof ErrorEvent) {
        this.errorEventsRepository.create({
          message: error.message,
          stack: error.stack,
          createdAt: new Date(),
          payload: error.payload,
          code: error.code,
        });
      }
      throw error;
    }
  }

  private validateTotal({movement, paymentItems, generateCashFlow}: {movement: Movement, paymentItems: PaymentItem[], generateCashFlow: boolean}) {
    const { data } = movement;
    const { total, items } = data as PurchaseData;
    const itemsTotal = items.reduce((acc, item) => acc + item.quantity * item.purchasePrice, 0);
    if(!generateCashFlow) {
      if (total !== itemsTotal) {
        throw new BadRequestException(ERRORS[ERROR_CODES.TOTAL_INVALID]);
      }
      return;
    }
    const paymentItemsTotal = paymentItems.reduce((acc, item) => acc + item.amount, 0);
    if (total !== itemsTotal || total !== paymentItemsTotal) {
      throw new BadRequestException(ERRORS[ERROR_CODES.TOTAL_INVALID]);
    }
  }

  findAll() {
    return this.movementsRepository.findByMovementType({subsidiaryId: this.request.subsidiaryId, movementType: MovementType.PURCHASE});
  }

  async findOne(id: string) {
    this.logger.debug(`Finding movement - ${id}`);
    const movement = await this.movementsRepository.findById(id);
    return this.fill(movement);
  }

  update(id: string, updatePurchaseDto: UpdatePurchaseDto) {
    throw new InternalServerErrorException('Method not implemented.');
    return `This action updates a #${id} sale`;
  }

  remove(id: string) {
    throw new InternalServerErrorException('Method not implemented.');
    return this.movementsRepository.delete(id);
  }

  async fill(movement: Movement): Promise<Movement> {
    this.logger.debug(`Filling purchase - ${movement.id}`);
    const data = movement.data as PurchaseData;
    const productIds = data.items.map(item => item.productId);
    this.logger.debug(`Product ids: ${productIds.join(', ')}`);
    const products = await this.productsRepository.selectAndFindByIds(productIds, PRODUCT_BASIC_FIELDS);
    this.logger.debug(`Products found: ${products.length}`);
    data.items = data.items.map(item => ({
      ...item,
      product: products.find(product => product.id === item.productId)
    }));
    return movement;
  }
}
