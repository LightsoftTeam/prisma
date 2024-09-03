import { InjectModel } from '@nestjs/azure-database';
import { Injectable } from '@nestjs/common';
import type { Container } from '@azure/cosmos';
import { Movement, Kardex } from '../entities';
import { ApplicationLoggerService } from 'src/common/services/application-logger.service';
import { Repository } from './repository';
import { KardexRepository } from './kardex.repository';

@Injectable()
export class MovementsRepository extends Repository<Movement> {

    constructor(
        @InjectModel(Movement) container: Container,
        private readonly logger: ApplicationLoggerService,
        private readonly kardexRepository: KardexRepository,
    ) {
        super(container);
        this.logger.setContext(MovementsRepository.name);
    }

    async create(movement: Movement) {
        this.logger.debug(`Creating movement - ${movement.type}`);
        await this.validate(movement);
        const newMovement = await super.create(movement);
        const kardexRows: Kardex[] = movement.items.map(item => ({
            productId: item.productId,
            quantity: -item.quantity,
            movementId: newMovement.id,
            subsidiaryId: newMovement.subsidiaryId,
            createdAt: newMovement.createdAt,
        }));
        try {
            await this.kardexRepository.createStockMovements(kardexRows);
        } catch (error) {
            this.logger.debug(`Error creating stock movements ${error.message}, reverting movement creation`);
            await super.destroy(newMovement.id, 'subsidiaryId');
            throw error;
        }
        return newMovement;
    }

    private async validate(movement: Movement) {
        const { subsidiaryId } = movement;
        //TODO: Validate if subsidiary exists
    }
}