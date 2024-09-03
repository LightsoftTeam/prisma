import { InjectModel } from '@nestjs/azure-database';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import type { Container } from '@azure/cosmos';
import { BulkOperationType, OperationInput } from '@azure/cosmos';
import { StockMovement } from '../entities';
import { ApplicationLoggerService } from 'src/common/services/application-logger.service';
import { Repository } from './repository';
import { ProductsRepository } from './products.repository';
import { ERROR_CODES, ERRORS } from 'src/common/constants/errors.constants';

@Injectable()
export class StockMovementsRepository extends Repository<StockMovement> {

    constructor(
        @InjectModel(StockMovement) container: Container,
        private readonly logger: ApplicationLoggerService,
        private readonly productsRepository: ProductsRepository,
    ) {
        super(container);
        this.logger.setContext(StockMovementsRepository.name);
    }

    async createMovements(stockMovements: StockMovement[]) {
        this.logger.debug('Creating stock movements');
        const productIds = stockMovements.map(stockMovement => stockMovement.productId);
        const products = await this.productsRepository.findByIds(productIds);
        if (products.length !== productIds.length) {
            throw new NotFoundException(`Product not found`);
        }
        stockMovements.forEach(stockMovement => {
            const product = products.find(product => product.id === stockMovement.productId);
            const quantity = stockMovement.quantity;
            if(product.stock + quantity < 0) {
                throw new BadRequestException(ERRORS[ERROR_CODES.STOCK_IS_NOT_ENOUGH]);
            }
            product.stock += quantity;
        });
        const movementsPromises = this.container.items.batch(stockMovements.map(stockMovement => {
            const resourceBody = JSON.parse(JSON.stringify(stockMovement));
            const operationInput: OperationInput = {
                operationType: BulkOperationType.Create,
                resourceBody,
            };
            return operationInput;
        }), stockMovements[0].subsidiaryId);
        const productPromises = this.productsRepository.updateInBatch(products, 'enterpriseId');
        const [{code: movementsCode, result: movementsResult}, {code: productsCode, result: productsResult}] = await Promise.all([movementsPromises, productPromises]);
        this.logger.debug(`Movements code: ${movementsCode}, Products code: ${productsCode}`);
        this.logger.debug(`Movements result: ${JSON.stringify(movementsResult)}, Products result: ${JSON.stringify(productsResult)}`);
        if (movementsCode !== 200 || productsCode !== 200) {
            const error = new Error();
            error.message = 'Error creating stock movements';
            error['code'] = movementsCode;
            throw error;
        }
    }
}