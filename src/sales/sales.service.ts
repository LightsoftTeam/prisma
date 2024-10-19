import { BadRequestException, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateSaleDto } from './dto/create-sale.dto';
import { ApplicationLoggerService } from 'src/common/services/application-logger.service';
import { Movement, MovementType, SaleData } from 'src/domain/entities';
import { v4 as uuidv4 } from 'uuid';
import { MovementsRepository, ProductsRepository } from 'src/domain/repositories';
import { UsersService } from 'src/users/users.service';
import { ErrorEventsRepository } from 'src/domain/repositories/error-events.repository';
import { ErrorEvent } from 'src/domain/errors/error-event.error';
import { ERROR_CODES, ERRORS } from 'src/common/constants/errors.constants';
import { REQUEST } from '@nestjs/core';

const BASIC_PRODUCT_FIELDS = ['id', 'name'];

@Injectable()
export class SalesService {

  constructor(
    private readonly logger: ApplicationLoggerService,
    private readonly productsRepository: ProductsRepository,
    private readonly errorEventsRepository: ErrorEventsRepository,
    private readonly usersService: UsersService,
    private readonly movementsRepository: MovementsRepository,
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
        paymentItems, 
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
      this.validate(movement);
      this.logger.debug(`Creating movement - ${movement.type}`);
      const newMovement = await this.movementsRepository.create(movement);
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

  private validate(movement: Movement) {
    const { data } = movement;
    const { total, items, paymentItems } = data as SaleData;
    const itemsTotal = items.reduce((acc, item) => acc + item.quantity * item.salePrice, 0);
    const paymentItemsTotal = paymentItems.reduce((acc, item) => acc + item.amount, 0);
    if (total !== itemsTotal || total !== paymentItemsTotal) {
      throw new BadRequestException(ERRORS[ERROR_CODES.TOTAL_INVALID]);
    }
  }

  findAll() {
    return this.movementsRepository.findBySubsidiaryId(this.request.subsidiaryId);
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
