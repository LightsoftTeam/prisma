import { BadRequestException, Injectable } from '@nestjs/common';
import type { SqlQuerySpec, Container, PartitionKey, OperationResponse, Response } from '@azure/cosmos';
import { OperationInput, BulkOperationType } from '@azure/cosmos';
import { ErrorEvent } from '../errors/error-event.error';

const COSMOS_SUCCES_OPERATION_CODES = [200, 201, 202, 204, 207];
@Injectable()
export class Repository<T> {

    container: Container;

    constructor(container: Container) {
        this.container = container;
    }

    async find(querySpec: SqlQuerySpec): Promise<T[]> {
        const { resources } = await this.container.items.query<T>(querySpec).fetchAll();
        return resources;
    }

    async findAll({
        orderBy = 'createdAt',
        orderDirection = 'DESC'
    }: {
        orderBy?: string;
        orderDirection?: 'ASC' | 'DESC';
    } = {}): Promise<T[]> {
        const querySpec = {
            query: `SELECT * FROM c WHERE NOT IS_DEFINED(c.deletedAt) ORDER BY c.${orderBy} ${orderDirection}`,
        };
        console.log(querySpec);
        const { resources } = await this.container.items.query(querySpec).fetchAll();
        return resources;
    }

    async findByEnterpriseId(enterpriseId: string): Promise<T[]> {
        const querySpec = {
            query: 'SELECT * FROM c where c.enterpriseId = @enterpriseId AND NOT IS_DEFINED(c.deletedAt) ORDER BY c.createdAt DESC',
            parameters: [
                {
                    name: '@enterpriseId',
                    value: enterpriseId
                }
            ],
        };

        const { resources } = await this.container.items.query(querySpec).fetchAll();
        console.log('findByEnterpriseId', resources.length);
        return resources;
    }

    async findBySubsidiaryId(subsidiaryId: string): Promise<T[]> {
        const querySpec = {
            query: 'SELECT * FROM c where c.subsidiaryId = @subsidiaryId AND NOT IS_DEFINED(c.deletedAt) ORDER BY c.createdAt DESC',
            parameters: [
                {
                    name: '@subsidiaryId',
                    value: subsidiaryId
                }
            ],
        };

        const { resources } = await this.container.items.query(querySpec).fetchAll();
        return resources;
    }

    async findById(id: string) {
        const querySpec: SqlQuerySpec = {
            query: 'SELECT * FROM c WHERE c.id = @id',
            parameters: [
                {
                    name: '@id',
                    value: id
                }
            ]
        };
        const { resources } = await this.container.items.query(querySpec).fetchAll();
        return resources.at(0) ?? null;
    }

    async findByIds(ids: string[]): Promise<T[]> {
        const querySpec: SqlQuerySpec = {
            query: 'SELECT * FROM c WHERE ARRAY_CONTAINS(@ids, c.id)',
            parameters: [
                {
                    name: '@ids',
                    value: ids
                }
            ]
        };

        const { resources } = await this.container.items.query(querySpec).fetchAll();
        return resources;
    }

    async create(newEntity: T) {
        const { resource } = await this.container.items.create<T>(newEntity);
        return resource;
    }

    async update(id: string, payload: Partial<T>) {
        const entity = await this.findById(id);
        if (!entity) {
            throw new BadRequestException(`Entity with id ${id} not found`);
        }
        const updatedEntity = {
            ...entity,
            ...payload,
            updatedAt: new Date()
        };
        const { resource } = await this.container.item(id).replace(updatedEntity);
        return resource;
    }

    async delete(id: string, partitionKeyName?: string): Promise<void> {
        const entity = await this.findById(id);
        if (!entity) {
            throw new BadRequestException(`Entity with id ${id} not found`);
        }
        await this.container.item(id, entity[partitionKeyName] ?? entity.id!).replace({
            ...entity,
            deletedAt: new Date()
        });
        return;
    }

    async destroy(id: string, partitionKeyName?: string): Promise<void> {
        const entity = await this.findById(id);
        if (!entity) {
            throw new BadRequestException(`Entity with id ${id} not found`);
        }
        await this.container.item(id, entity[partitionKeyName] ?? entity.id).delete();
        return;
    }

    async selectAndFindByIds(ids: string[], fields: string[]) {
        const querySpec: SqlQuerySpec = {
            query: `SELECT ${fields.map(f => 'c.' + f).join(',')} FROM c WHERE ARRAY_CONTAINS(@ids, c.id)`,
            parameters: [
                {
                    name: '@ids',
                    value: ids
                }
            ]
        };
        const { resources } = await this.container.items.query(querySpec).fetchAll();
        return resources;
    }

    async updateInBatch(entities: T[], partitionKeyName?: string) {
        if (entities.length === 0) throw new BadRequestException('No entities to update');
        const partitionKey: PartitionKey = entities[0][partitionKeyName];
        const operations = entities.map(entity => {
            const resourceBody = JSON.parse(JSON.stringify(entity));
            // resourceBody._etag = '0300525c-0000-4d00-0000-66d742d40000';
            const operationInput: OperationInput = {
                id: entity['id'],
                operationType: BulkOperationType.Replace,
                resourceBody,
                ifMatch: resourceBody['_etag']
            };
            return operationInput;
        });
        const batchResponse = await this.container.items.batch(operations, partitionKey);
        this.validateBatchResponse(batchResponse);
        return { code: batchResponse.code, result: batchResponse.result.map(result => result.statusCode) };
    }

    async createInBatch(entities: T[], partitionKeyName?: string) {
        if (entities.length === 0) throw new BadRequestException('No entities to create');
        const partitionKey = entities[0][partitionKeyName];
        const operations = entities.map(stockMovement => {
            const resourceBody = JSON.parse(JSON.stringify(stockMovement));
            const operationInput: OperationInput = {
                operationType: BulkOperationType.Create,
                resourceBody,
            };
            return operationInput;
        });
        const batchResponse = await this.container.items.batch(operations, partitionKey);
        this.validateBatchResponse(batchResponse);
        return { code: batchResponse.code, result: batchResponse.result.map(result => result.statusCode) };
    }

    private readonly validateBatchResponse = (batchResponse: Response<OperationResponse[]>) => {
        const { code, result } = batchResponse;
        if (code !== 200) {
            const message = 'Error createInBatch, code is not 200';
            throw new ErrorEvent(message, code, result);
        }
        if (result.some((result: any) => !COSMOS_SUCCES_OPERATION_CODES.includes(result.statusCode))) {
            const message = 'Error in batch, http status code was 200 but operations not were successful';
            throw new ErrorEvent(message, 500, result);
        }
    }
}
