import { BadRequestException, Injectable } from '@nestjs/common';
import type { SqlQuerySpec, Container, PartitionKey } from '@azure/cosmos';
import { ApplicationLoggerService } from 'src/common/services/application-logger.service';
import { OperationInput } from '@azure/cosmos';


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

    async selectAndFindByIds(ids: string[], fields: string[]){
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
        if(entities.length === 0) throw new BadRequestException('No entities to update');
        const partitionKey: PartitionKey = entities[0][partitionKeyName];
        const operations = entities.map(entity => {
            const resourceBody = JSON.parse(JSON.stringify(entity));
            const operationInput: OperationInput = {
                id: entity['id'],
                operationType: 'Replace',
                resourceBody: {
                    ...resourceBody,
                },
                ifMatch: entity['_etag']               
            };
            return operationInput;
        });
        console.log(operations)
        const {code, headers, diagnostics, result, substatus} = await this.container.items.batch(operations, partitionKey);
        console.log({code, headers, diagnostics, result, substatus});
        return { code, result };
    }
}
