import { BadRequestException, Injectable } from '@nestjs/common';
import type { SqlQuerySpec, Container, PartitionKey, OperationResponse } from '@azure/cosmos';
import { OperationInput, BulkOperationType } from '@azure/cosmos';
import { ErrorEvent } from '../errors/error-event.error';
import { wait } from 'src/common/helpers/wait.helper';

const COSMOS_SUCCES_OPERATION_CODES = [200, 201, 202, 204, 207];
const RETRIES_WHEN_ETAG_IS_NOT_THE_SAME = 3;
const RETRY_DELAY = 1000;

export interface COSMOS_ENTITY {
    id?: string;
}

export interface Condition{
    operator: string;
    value: string | number;
}

export class Operators {
    static MoreThan(value: number) {
        return { operator: '>', value };
    }

    static LessThan(value: number) {
        return { operator: '<', value };
    }

    static Equals(value: any) {
        return { operator: '=', value };
    }

    static Like(value: string) {
        return { operator: 'LIKE', value };
    }
}

export interface WhereItem {
    [key: string]: string | number | Condition;
}

@Injectable()
export class Repository<T extends COSMOS_ENTITY> {

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
        where = [],
        orderDirection = 'DESC'
    }: {
        orderBy?: string;
        orderDirection?: 'ASC' | 'DESC';
        where?: WhereItem[];
    } = {}): Promise<T[]> {
        const querySpec = {
            query: `SELECT * FROM c WHERE NOT IS_DEFINED(c.deletedAt)`,
            parameters: []
        };
        for (const whereItem of where) {
            querySpec.query += ` AND (`;
            querySpec.query += Object.entries(whereItem).map((fieldCondition) => {
                const [field, condition] = fieldCondition;
                let { operator, value } = typeof condition === 'object' ? condition : Operators.Equals(condition);
                querySpec.parameters.push({
                    name: `@${field}`,
                    value: typeof value === 'string' ? value.toLowerCase() : value
                });
                if(operator === 'LIKE'){
                    return `CONTAINS(LOWER(c.${field}), @${field})`;
                }
                return `c.${field} ${operator} @${field}`;
            }).join(' OR ') + ')';
        }
        querySpec.query += ` ORDER BY c.${orderBy} ${orderDirection}`;
        console.log('Find all query: ' + JSON.stringify(querySpec));
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
        const { resources } = await this.container.items.query<T>(querySpec).fetchAll();
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

    async update(id: string, payload: Partial<T>, {
        concurrencyRetryTimes = 2
    }: {concurrencyRetryTimes?: number} = {}) {
        const entity = await this.findById(id);
        if (!entity) {
            throw new BadRequestException(`Entity with id ${id} not found`);
        }
        const updatedEntity = {
            ...entity,
            ...payload,
            updatedAt: new Date()
        };
        let attemp = 0;
        while (attemp < concurrencyRetryTimes) {
            const { resource, statusCode } = await this.container.item(id).replace<T>(updatedEntity, {
                accessCondition: {
                    type: 'IfMatch',
                    condition: entity['_etag']
                }
            });
            console.log({statusCode});
            if (statusCode === 200) {
                return resource;
            }
            if(statusCode === 412) {
                console.log('Error 412');
                attemp++;
                if (attemp >= concurrencyRetryTimes) {
                    throw new ErrorEvent('The item has been changed by another process. Max retries reached. Update failed.', 500, resource);
                }
                console.log(`waiting ${RETRY_DELAY} ms`);
                await wait(RETRY_DELAY);
                console.log('retrying...');
            }
        }
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
        console.log({querySpec});
        const { resources } = await this.container.items.query(querySpec).fetchAll();
        return resources;
    }

    async updateInBatch(entities: T[], options?: { partitionKeyName?: string, retries?: number }) {
        if (entities.length === 0) throw new BadRequestException('No entities to update');
        const { partitionKeyName, retries } = options ?? {};
        const partitionKey: PartitionKey = entities[0][partitionKeyName];
        const getOperations = (entities: T[]) => {
            return entities.map(entity => {
                const resourceBody = JSON.parse(JSON.stringify(entity));
                console.log({resourceBody});
                const operationInput: OperationInput = {
                    id: entity['id'],
                    operationType: BulkOperationType.Replace,
                    resourceBody,
                    ifMatch: resourceBody['_etag']
                };
                return operationInput;
            });
        };
        return this.executeBatch({ entities, getOperations, partitionKey, retries });
    }

    private async executeBatch({
        entities,
        getOperations,
        partitionKey,
        retries = RETRIES_WHEN_ETAG_IS_NOT_THE_SAME,
    }: {
        entities: T[],
        getOperations: (entities: T[]) => OperationInput[],
        partitionKey: PartitionKey,
        retries?: number,
    }) {
        let attemp = 0;
        while (attemp < retries) {
            const updatedEntities = attemp === 0 ? entities : await this.updateEtags(entities);
            const operations = getOperations(updatedEntities);
            const batchResponse = await this.container.items.batch(operations, partitionKey);
            const { code, result } = batchResponse;
            console.log('update in batch', { code, result: result.map(r => r.statusCode) });
            if(code === 200){
                console.log('code is 200');
            }
            if (code === 200 && result.every(result => COSMOS_SUCCES_OPERATION_CODES.includes(result.statusCode))) {
                return { code, result };
            }
            if (result.some((result: OperationResponse) => result.statusCode === 412)) {
                console.log('Error 412');
                attemp++;
                if (attemp >= retries) {
                    throw new ErrorEvent('Max retries reached. Update failed.', 500, result);
                }
                console.log(`waiting ${RETRY_DELAY} ms`);
                await wait(RETRY_DELAY);
                console.log('retrying...');
            } else {
                throw new ErrorEvent('Error in batch, http status code was 200 but operations not were successful', 500, result);
            }
        }
    }

    private async updateEtags<T>(entities: T[]) {
        const newEtags = await this.selectAndFindByIds(entities.map(entity => entity['id']), ['id', '_etag']);
        const newEntities = entities.map(entity => {
            const newEtag = newEtags.find(etag => etag['id'] === entity['id'])!['_etag'];
            console.log({ oldEtag: entity['_etag'], newEtag });
            return { ...entity, _etag: newEtag };
        });
        return newEntities;
    }

    async createInBatch(entities: T[], options?: { partitionKeyName?: string }) {
        if (entities.length === 0) throw new BadRequestException('No entities to create');
        const { partitionKeyName } = options ?? {};
        const partitionKey = entities[0][partitionKeyName];
        const getOperations = (entities: T[]) => {
            return entities.map(stockMovement => {
                const resourceBody = JSON.parse(JSON.stringify(stockMovement));
                const operationInput: OperationInput = {
                    operationType: BulkOperationType.Create,
                    resourceBody,
                };
                return operationInput;
            });
        };
        return this.executeBatch({ entities, getOperations, partitionKey });
    }

    async destroyInBatch(ids: string[], partitionKey: string) {
        if (ids.length === 0) throw new BadRequestException('No entities to destroy');
        const operations = ids.map(id => {
            const operationInput: OperationInput = {
                id,
                operationType: BulkOperationType.Delete,
            };
            return operationInput;
        });
        const batchResponse = await this.container.items.batch(operations, partitionKey);
        const { code, result } = batchResponse;
        if (code === 200 && result.every(result => COSMOS_SUCCES_OPERATION_CODES.includes(result.statusCode))) {
            return { code, result };
        }
        throw new ErrorEvent('Error in batch, http status code was 200 but operations not were successful', 500, result);
    }

    fill({
        entity,
        entities,
        options
    }: {
        entity?: T,
        entities?: T[],
        options: {
            field: string,
            foreignName: string;
            items: { [key: string]: any }[],
        }[]
    }){
        if(!entity && !entities) throw new Error('Entity or entities must be provided');
        if(entity && entities) throw new Error('Entity and entities cannot be provided at the same time');
        for (const option of options) {
            if(entity) {
                entity[option.field] = option.items.find(item => item.id === entity[option.foreignName]);
            } else {
                entities.forEach(entity => {
                    entity[option.field] = option.items.find(item => item.id === entity[option.foreignName]);
                });
            }
        }
        return entity ?? entities;
    }
}
