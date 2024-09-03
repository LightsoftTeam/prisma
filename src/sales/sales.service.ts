import { Injectable } from '@nestjs/common';
import { CreateSaleDto } from './dto/create-sale.dto';
import { ApplicationLoggerService } from 'src/common/services/application-logger.service';
import { SalesRepository } from 'src/domain/repositories/sales.repository';
import { ErrorEventType, Sale } from 'src/domain/entities';
import { v4 as uuidv4 } from 'uuid';
import { FindByEnterpriseDto } from 'src/common/dto/find-by-enterprise.dto';
import { ProductsRepository } from 'src/domain/repositories';
import { UsersService } from 'src/users/users.service';
import { ErrorEventsRepository } from 'src/domain/repositories/error-events.repository';

const BASIC_PRODUCT_FIELDS = ['id, name'];

@Injectable()
export class SalesService {
  
  constructor(
    private readonly logger: ApplicationLoggerService,
    private readonly salesRepository: SalesRepository,
    private readonly productsRepository: ProductsRepository,
    private readonly errorEventsRepository: ErrorEventsRepository,
    private readonly usersService: UsersService,
  ) {}

  async create(createSaleDto: CreateSaleDto) {
    try {
      this.logger.debug('Creating sale');
      const {items} = createSaleDto;
      const loggedUser = this.usersService.getLoggedUser();
      const sale: Sale = {
        ...createSaleDto,
        items: items.map(item => ({
          ...item,
          id: uuidv4()
        })),
        userId: loggedUser.id,
        createdAt: new Date(),
      };
      return this.salesRepository.create(sale);
    } catch (error) {
      this.logger.error(`Error creating sale ${error.message}`);
      this.errorEventsRepository.create({
        message: error.message,
        stack: error.stack,
        createdAt: new Date(),
        code: error.code ?? ErrorEventType.OPERATION_ERROR,
      });
      throw error;
    }
  }

  findAll(findSalesDto: FindByEnterpriseDto) {
    const { enterpriseId } = findSalesDto;
    return this.salesRepository.findByEnterpriseId(enterpriseId);
  }

  async findOne(id: string) {
    const sale = await this.salesRepository.findById(id);
    return this.fill(sale);
  }

  // update(id: number, updateSaleDto: UpdateSaleDto) {
  //   return `This action updates a #${id} sale`;
  // }

  remove(id: string) {
    return this.salesRepository.delete(id);
  }

  async fill(sale: Sale): Promise<Sale>{
    const productIds = sale.items.map(item => item.productId);
    const products = await this.productsRepository.selectAndFindByIds(productIds, BASIC_PRODUCT_FIELDS);
    sale.items = sale.items.map(item => ({
      ...item,
      product: products.find(product => product.id === item.productId)
    }));
    return sale; 
  }
}
