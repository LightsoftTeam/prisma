import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateSaleDto } from './dto/create-sale.dto';
import { ApplicationLoggerService } from 'src/common/services/application-logger.service';
import { Movement, MovementType, SaleData } from 'src/domain/entities';
import { v4 as uuidv4 } from 'uuid';
import { MovementsRepository, ProductsRepository } from 'src/domain/repositories';
import { UsersService } from 'src/users/users.service';
import { ErrorEventsRepository } from 'src/domain/repositories/error-events.repository';
import { ErrorEvent } from 'src/domain/errors/error-event.error';
import { ERROR_CODES, ERRORS } from 'src/common/constants/errors.constants';
import { FindBySubsidiaryDto } from 'src/common/dto/find-by-sucursal.dto';

const BASIC_PRODUCT_FIELDS = ['id', 'name'];

@Injectable()
export class SalesService {

  constructor(
    private readonly logger: ApplicationLoggerService,
    private readonly productsRepository: ProductsRepository,
    private readonly errorEventsRepository: ErrorEventsRepository,
    private readonly usersService: UsersService,
    private readonly movementsRepository: MovementsRepository,
  ) {
    this.logger.setContext(SalesService.name);
  }

  async create(createSaleDto: CreateSaleDto) {
    try {
      this.logger.debug('Creating sale');
      const { items, total, paymentMethod, customerId, ...movementData } = createSaleDto;
      const loggedUser = this.usersService.getLoggedUser();
      const data: SaleData = {
        customerId,
        paymentMethod,
        total,
      }
      const movement: Movement = {
        ...movementData,
        type: MovementType.SALE,
        userId: loggedUser.id,
        data,
        items: items.map(item => ({
          ...item,
          id: uuidv4()
        })),
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
    const { items, data } = movement;
    const { total } = data;
    const itemsTotal = items.reduce((acc, item) => acc + item.quantity * item.salePrice, 0);
    if (total !== itemsTotal) {
      throw new BadRequestException(ERRORS[ERROR_CODES.TOTAL_INVALID]);
    }
  }

  findAll(findSalesDto: FindBySubsidiaryDto) {
    const { subsidiaryId } = findSalesDto;
    return this.movementsRepository.findBySubsidiaryId(subsidiaryId);
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
    const productIds = movement.items.map(item => item.productId);
    this.logger.debug(`Product ids: ${productIds.join(', ')}`);
    const products = await this.productsRepository.selectAndFindByIds(productIds, BASIC_PRODUCT_FIELDS);
    this.logger.debug(`Products found: ${products.length}`);
    movement.items = movement.items.map(item => ({
      ...item,
      product: products.find(product => product.id === item.productId)
    }));
    return movement;
  }
}
