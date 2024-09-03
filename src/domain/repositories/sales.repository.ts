import { InjectModel } from '@nestjs/azure-database';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import type { Container } from '@azure/cosmos';
import { ErrorEventType, Sale, Source, StockMovement } from '../entities';
import { ApplicationLoggerService } from 'src/common/services/application-logger.service';
import { Repository } from './repository';
import { ERROR_CODES, ERRORS } from 'src/common/constants/errors.constants';
import { SubsidiariesRepository } from './subsidiaries.repository';
import { StockMovementsRepository } from './stock-movement.repository';

@Injectable()
export class SalesRepository extends Repository<Sale> {

    constructor(
        @InjectModel(Sale) container: Container,
        private readonly logger: ApplicationLoggerService,
        private readonly subsidiariesRepository: SubsidiariesRepository,
        private readonly stockMovementsRepository: StockMovementsRepository,
    ) {
        super(container);
        this.logger.setContext(SalesRepository.name);
    }

    async create(sale: Sale) {
        this.logger.debug('Creating sale');
        await this.validate(sale);
        const newSale = await super.create(sale);
        const movements: StockMovement[] = sale.items.map(item => ({
            productId: item.productId,
            quantity: -item.quantity,
            source: Source.SALE,
            sourceId: newSale.id,
            subsidiaryId: newSale.subsidiaryId,
            createdAt: sale.createdAt,
        }));
        try {
            await this.stockMovementsRepository.createMovements(movements);
        } catch (error) {
            this.logger.debug(`Error creating stock movements ${error.message}, reverting sale`);
            await super.destroy(newSale.id, 'subsidiaryId');
            error.code = ErrorEventType.ATOMICITY_ERROR;
            throw error;
        }
        return newSale;
    }

    private async validate(sale: Sale) {
        const total = sale.items.reduce((acc, item) => acc + (item.quantity * item.salePrice), 0);
        if (total !== sale.total) {
            throw new BadRequestException(ERRORS[ERROR_CODES.TOTAL_INVALID]);
        }
        const subsidiary = await this.subsidiariesRepository.findById(sale.subsidiaryId);
        if (!subsidiary) {
            throw new NotFoundException('Subsidiary not found');
        }
    }
}