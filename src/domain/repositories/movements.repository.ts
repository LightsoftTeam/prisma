import { InjectModel } from '@nestjs/azure-database';
import { BadRequestException, Injectable } from '@nestjs/common';
import type { Container } from '@azure/cosmos';
import { Movement, Kardex, MovementType, SaleData, KardexFlowType, PurchaseData, SaleItem, PurchaseItem } from '../entities';
import { ApplicationLoggerService } from 'src/common/services/application-logger.service';
import { Repository } from './repository';
import { KardexRepository } from './kardex.repository';
import { SubsidiariesRepository } from './subsidiaries.repository';

const MOVEMENT_TYPES_THAT_AFFECT_STOCK = [
    MovementType.SALE,
    MovementType.PURCHASE, 
];

@Injectable()
export class MovementsRepository extends Repository<Movement> {

    constructor(
        @InjectModel(Movement) container: Container,
        private readonly logger: ApplicationLoggerService,
        private readonly kardexRepository: KardexRepository,
        private readonly subsidiariesRepository: SubsidiariesRepository,
    ) {
        super(container);
        this.logger.setContext(MovementsRepository.name);
    }

    async create(movement: Movement) {
        this.logger.debug(`Creating movement - ${movement.type}`);
        await this.validate(movement);
        const newMovement = await super.create(movement);
        if(this.itAffectsStock(movement)) {
            const kardexRows = this.getKardexRows(movement);
            try {
                await this.kardexRepository.createStockMovements(kardexRows);
            } catch (error) {
                this.logger.debug(`Error creating stock movements ${error.message}, reverting movement creation`);
                await super.destroy(newMovement.id, 'subsidiaryId');
                throw error;
            }
        }
        return newMovement;
    }

    async findByMovementType({movementType, subsidiaryId}: {movementType: MovementType, subsidiaryId: string}){
        const querySpec = {
            query: `SELECT * FROM c WHERE c.type = @type AND c.subsidiaryId = @subsidiaryId`,
            parameters: [
                { name: '@type', value: movementType },
                { name: '@subsidiaryId', value: subsidiaryId },
            ],
        }
        const { resources } = await this.container.items.query<Movement>(querySpec).fetchAll();
        return resources;
    }

    private itAffectsStock(movement: Movement) {
        return MOVEMENT_TYPES_THAT_AFFECT_STOCK.includes(movement.type);
    }

    private getKardexRows(movement: Movement): Kardex[] {
        const data: SaleData | PurchaseData = movement.data as SaleData | PurchaseData;
        const kardexItems: Kardex[] = data.items.map((item: SaleItem | PurchaseItem) => {
            return {
                productId: item.productId,
                quantity: item.quantity,
                subsidiaryId: movement.subsidiaryId,
                movementId: movement.id,
                flowType: KardexFlowType.OUTCOME,
                createdAt: new Date(),
            };
        });
        return kardexItems;
    }

    private async validate(movement: Movement) {
        const { subsidiaryId, parentId } = movement;
        const [subsidiary, parent] = await Promise.all([
            this.subsidiariesRepository.findById(subsidiaryId),
            parentId ? super.findById(parentId) : null,
        ]);
        if(!subsidiary) {
            throw new BadRequestException('Subsidiary not found');
        }
        if(parentId && !parent) {
            throw new BadRequestException('Parent movement not found');
        }
    }
}