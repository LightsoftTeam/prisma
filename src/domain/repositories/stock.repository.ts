import { InjectModel } from '@nestjs/azure-database';
import { Injectable } from '@nestjs/common';
import type { Container } from '@azure/cosmos';
import { ApplicationLoggerService } from 'src/common/services/application-logger.service';
import { Repository } from './repository';
import { Stock } from '../entities/stock.entity';

@Injectable()
export class StockRepository extends Repository<Stock> {

    constructor(
        @InjectModel(Stock) container: Container,
        private readonly logger: ApplicationLoggerService,
    ) {
        super(container);
        this.logger.setContext(StockRepository.name);
    }

    /**
     * Updates the stock of a specific product in a given subsidiary.
     *
     * This method checks if there is an existing stock record for a product in a specified subsidiary.
     * If a record exists, it increments the stock by the given amount and updates the record. If no record is found,
     * it creates a new stock entry for the product and subsidiary with the provided stock quantity.
     *
     * @param params - An object containing:
     *   - `productId`: Unique identifier of the product.
     *   - `stock`: The stock amount to add.
     *   - `subsidiaryId`: Unique identifier of the subsidiary.
     * @returns A promise that resolves to the updated or newly created `Stock` record.
     *
     * @example
     * // Update the stock of a product in a subsidiary
     * const updatedStock = await this.updateStock({ productId: "prod123", stock: 10, subsidiaryId: "subs456" });
     * console.log(updatedStock); // Example output: updated stock record with incremented stock or new stock entry.
     */
    async updateStock(params: { productId: string, stock: number, subsidiaryId: string }): Promise<Stock> {
        const { productId, stock, subsidiaryId } = params;
        const querySpec = {
            query: 'SELECT * FROM c WHERE c.productId = @productId AND c.subsidiaryId = @subsidiaryId',
            parameters: [
                { name: '@productId', value: productId },
                { name: '@subsidiaryId', value: subsidiaryId },
            ],
        }
        const { resources } = await this.container.items.query<Stock>(querySpec).fetchAll();
        let item: Stock | null = resources.at(0);
        if (!item) {
            item = {
                productId,
                stock,
                subsidiaryId,
                createdAt: new Date(),
            }
            const { resource } = await this.container.items.create(item);
            return resource;
        }
        item.stock += stock;
        item.updatedAt = new Date();
        return super.update(item.id, item, {
            concurrencyRetryTimes: 3,
        });
    }

    async getOrCreateStock(params: { productId: string, subsidiaryId: string }): Promise<Stock> {
        const { productId, subsidiaryId } = params;
        const querySpec = {
            query: 'SELECT * FROM c WHERE c.productId = @productId AND c.subsidiaryId = @subsidiaryId',
            parameters: [
                { name: '@productId', value: productId },
                { name: '@subsidiaryId', value: subsidiaryId },
            ],
        }
        const { resources } = await this.container.items.query<Stock>(querySpec).fetchAll();
        let item: Stock | null = resources.at(0);
        if (!item) {
            item = {
                productId,
                stock: 0,
                subsidiaryId,
                createdAt: new Date(),
            }
            const { resource } = await this.container.items.create(item);
            return resource;
        }
        return item;
    }

    /**
      * Retrieves the stock of a specific product in a given subsidiary.
      *
      * This method queries the database to find the stock record of a product in a specified subsidiary.
      * It uses a parameterized query to filter by `productId` and `subsidiaryId`, returning the available
      * stock quantity if the product is found in that subsidiary. If no record is found, it returns 0.
      *
      * @param productId - Unique identifier of the product.
      * @param subsidiaryId - Unique identifier of the subsidiary.
      * @returns A promise that resolves to the available stock quantity for the product in the specified subsidiary,
      *          or `null` if no record is found.
      *
      * @example
      * // Get the stock of a product in a subsidiary
      * const stock = await this.getStock("prod123", "subs456");
      * console.log(stock); // Example output: 25 or 0 if the product is not found.
      */
    async getStockBySubsidiary(productId: string, subsidiaryId: string): Promise<number | null> {
        const querySpec = {
            query: 'SELECT * FROM c WHERE c.productId = @productId AND c.subsidiaryId = @subsidiaryId',
            parameters: [
                { name: '@productId', value: productId },
                { name: '@subsidiaryId', value: subsidiaryId },
            ],
        }
        const { resources } = await this.container.items.query<Stock>(querySpec).fetchAll();
        if(resources.length === 0) {
            return 0;
        }
        return resources.reduce((acc, item) => acc + item.stock, 0);
    }
}