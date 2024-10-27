import { InjectModel } from '@nestjs/azure-database';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import type { Container } from '@azure/cosmos';
import { Kardex, KardexFlowType } from '../entities';
import { ApplicationLoggerService } from 'src/common/services/application-logger.service';
import { Repository } from './repository';
import { ProductsRepository } from './products.repository';
import { ERROR_CODES, ERRORS } from 'src/common/constants/errors.constants';
import { v4 as uuidv4 } from 'uuid';
import { StockRepository } from './stock.repository';

@Injectable()
export class KardexRepository extends Repository<Kardex> {

    constructor(
        @InjectModel(Kardex) container: Container,
        private readonly logger: ApplicationLoggerService,
        private readonly productsRepository: ProductsRepository,
        private readonly stockRepository: StockRepository,
    ) {
        super(container);
        this.logger.setContext(KardexRepository.name);
    }

    async createStockMovements(stockMovements: Kardex[]): Promise<void> {
        if(stockMovements.length === 0) {
            return;
        }
        const partitionKey = stockMovements[0].subsidiaryId;
        this.logger.log('Creating stock movements - kardex');
        const productIds = stockMovements.map(stockMovement => stockMovement.productId);
        this.logger.debug(`Product ids: ${productIds.join(', ')}`);
        const products = await this.productsRepository.findByIds(productIds);
        if (products.length !== productIds.length) {
            throw new NotFoundException(`Product not found`);
        }
        const stockMovementIds = [];
        const stockItems = [];
        const promises = stockMovements.map(async stockMovement => {
            const { flowType, quantity, productId } = stockMovement;
            const product = products.find(product => product.id === productId);
            const quantityWithFlow = flowType === KardexFlowType.INCOME ? quantity : -quantity;
            //TODO: Update when exists color and size
            const stockItem = await this.stockRepository.getOrCreateStock({ productId, subsidiaryId: stockMovement.subsidiaryId });
            if (stockItem.stock + quantityWithFlow < 0) {
                throw new BadRequestException({
                    ...ERRORS[ERROR_CODES.STOCK_IS_NOT_ENOUGH],
                    message: `Stock is not enough for product ${product.name}`,
                });
            }
            const newStock = stockItem.stock + quantityWithFlow;
            stockItem.stock = newStock;
            stockItem.updatedAt = new Date();
            stockItems.push(stockItem);
            const id = uuidv4();
            stockMovement.id = id;
            stockMovementIds.push(id);
        });
        await Promise.all(promises);
        await super.createInBatch(stockMovements, { partitionKeyName: 'subsidiaryId' });
        this.logger.log('Stock movements created');
        try {
            console.log({stockItems});
            await this.stockRepository.updateInBatch(stockItems, { partitionKeyName: 'subsidiaryId' });
            this.logger.log('Product stocks updated');
        } catch (error) {
            this.logger.debug(`Error updating sotcks ${error.message}, reverting stock movements creation`);
            await super.destroyInBatch(stockMovementIds, partitionKey);
            throw error;
        }
    }
}