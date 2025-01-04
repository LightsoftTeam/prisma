import { BadRequestException, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateSaleDto } from './dto/create-sale.dto';
import { ApplicationLoggerService } from 'src/common/services/application-logger.service';
import { CashBoxMovementData, CashFlowType, Movement, MovementType, PaymentItem, SaleData } from 'src/domain/entities';
import { v4 as uuidv4 } from 'uuid';
import { MovementsRepository, PaymentConceptsRepository, ProductsRepository } from 'src/domain/repositories';
import { UsersService } from 'src/users/users.service';
import { ErrorEventsRepository } from 'src/domain/repositories/error-events.repository';
import { ErrorEvent } from 'src/domain/errors/error-event.error';
import { ERROR_CODES, ERRORS } from 'src/common/constants/errors.constants';
import { REQUEST } from '@nestjs/core';
import { BASIC_PRODUCT_FIELDS } from 'src/common/constants/basic-fields.constants';

@Injectable()
export class SalesService {

  constructor(
    private readonly logger: ApplicationLoggerService,
    private readonly productsRepository: ProductsRepository,
    private readonly errorEventsRepository: ErrorEventsRepository,
    private readonly usersService: UsersService,
    private readonly movementsRepository: MovementsRepository,
    private readonly paymentConceptsRepository: PaymentConceptsRepository,
    @Inject(REQUEST) private readonly request: any,
  ) {
    this.logger.setContext(SalesService.name);
  }

  async create(createSaleDto: CreateSaleDto) {
    try {
      this.logger.debug('Creating sale');
      const { items, total, paymentItems, customerId, ...movementData } = createSaleDto;
      const loggedUser = this.usersService.getLoggedUser();
      const data: SaleData = {
        customerId,
        items: items.map(item => ({
          ...item,
          id: uuidv4()
        })),
        total,
      }
      const movement: Movement = {
        ...movementData,
        subsidiaryId: this.request.subsidiaryId,
        type: MovementType.SALE,
        createdById: loggedUser.id,
        data,
        createdAt: new Date(),
      };
      this.validateTotal({movement, paymentItems});
      this.logger.debug(`Creating movement - ${movement.type}`);
      const newMovement = await this.movementsRepository.create(movement);
      try {
        const cashBoxMovementData: CashBoxMovementData = {
          type: CashFlowType.INCOME,
          items: paymentItems.map(item => ({
            ...item,
            id: uuidv4(),
            createdAt: new Date(),
          })),
          paymentConceptId: this.paymentConceptsRepository.getPurchaseConceptId(),
          total,
        }
        const cashBoxMovementPayload: Movement = {
          type: MovementType.CASH_BOX,
          subsidiaryId: this.request.subsidiaryId,
          createdAt: new Date(),
          createdById: loggedUser.id,
          data: cashBoxMovementData,
          parentId: newMovement.id,
        }
        this.logger.debug('Creating cash box movement');
        await this.movementsRepository.create(cashBoxMovementPayload);
      } catch (error) {
        this.movementsRepository.delete(newMovement.id);
        throw error;
      }
      return newMovement;
    } catch (error) {
      this.logger.critical(`Error creating sale ${error.message}`);
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

  private validateTotal({movement, paymentItems}: {movement: Movement, paymentItems: PaymentItem[]}) {
    const { data } = movement;
    const { total, items } = data as SaleData;
    const itemsTotal = items.reduce((acc, item) => acc + item.quantity * item.salePrice, 0);
    const paymentItemsTotal = paymentItems.reduce((acc, item) => acc + item.amount, 0);
    if (total !== itemsTotal || total !== paymentItemsTotal) {
      throw new BadRequestException(ERRORS[ERROR_CODES.TOTAL_INVALID]);
    }
  }

  async findAll() {
    const movements = await this.movementsRepository.findByMovementType({subsidiaryId: this.request.subsidiaryId, movementType: MovementType.SALE});
    const productIds = movements.reduce((acc, movement) => {
      const data = movement.data as SaleData;
      return acc.concat(data.items.map(item => item.productId));
    }, []);
    const products = await this.productsRepository.selectAndFindByIds(productIds, BASIC_PRODUCT_FIELDS);
    movements.forEach(movement => {
      const data = movement.data as SaleData;
      data.items = data.items.map(item => ({
        ...item,
        product: products.find(product => product.id === item.productId)
      }));
    });
    return movements;
  }

  async findOne(id: string) {
    this.logger.debug(`Finding movement - ${id}`);
    const movement = await this.movementsRepository.findById(id);
    return this.fill(movement);
  }

  // update(id: number, updateSaleDto: UpdateSaleDto) {
  //   return `This action updates a #${id} sale`;
  // }

  remove(id: string) {
    throw new InternalServerErrorException('Method not implemented.');
    return this.movementsRepository.delete(id);
  }

  async fill(movement: Movement): Promise<Movement> {
    this.logger.debug(`Filling movement - ${movement.id}`);
    const data = movement.data as SaleData;
    const productIds = data.items.map(item => item.productId);
    this.logger.debug(`Product ids: ${productIds.join(', ')}`);
    const products = await this.productsRepository.selectAndFindByIds(productIds, BASIC_PRODUCT_FIELDS);
    this.logger.debug(`Products found: ${products.length}`);
    data.items = data.items.map(item => ({
      ...item,
      product: products.find(product => product.id === item.productId)
    }));
    return movement;
  }
}
