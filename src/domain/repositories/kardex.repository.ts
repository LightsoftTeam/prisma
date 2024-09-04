import { InjectModel } from '@nestjs/azure-database';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import type { Container } from '@azure/cosmos';
import { Kardex } from '../entities';
import { ApplicationLoggerService } from 'src/common/services/application-logger.service';
import { Repository } from './repository';
import { ProductsRepository } from './products.repository';
import { ERROR_CODES, ERRORS } from 'src/common/constants/errors.constants';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class KardexRepository extends Repository<Kardex> {

    constructor(
        @InjectModel(Kardex) container: Container,
        private readonly logger: ApplicationLoggerService,
        private readonly productsRepository: ProductsRepository,
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
        stockMovements.forEach(stockMovement => {
            const product = products.find(product => product.id === stockMovement.productId);
            const quantity = stockMovement.quantity;
            if (product.stock + quantity < 0) {
                throw new BadRequestException(ERRORS[ERROR_CODES.STOCK_IS_NOT_ENOUGH]);
            }
            product.stock += quantity;
            const id = uuidv4();
            stockMovement.id = id;
            stockMovementIds.push(id);
        });
        await super.createInBatch(stockMovements, { partitionKeyName: 'subsidiaryId' });
        this.logger.log('Stock movements created');
        try {
            await this.productsRepository.updateInBatch(products, { partitionKeyName: 'enterpriseId' });
            this.logger.log('Products updated');
        } catch (error) {
            this.logger.debug(`Error updating products ${error.message}, reverting stock movements creation`);
            await super.destroyInBatch(stockMovementIds, partitionKey);
            throw error;
        }
    }
}