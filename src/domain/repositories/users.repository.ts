import { InjectModel } from '@nestjs/azure-database';
import { Injectable } from '@nestjs/common';
import type { Container } from '@azure/cosmos';
import { User } from '../entities';
import { Repository } from './repository';

@Injectable()
export class UsersRepository extends Repository<User> {

    constructor(
        @InjectModel(User)
        private readonly usersContainer: Container,
    ) {
        super(usersContainer);
    }

    async findByUsername(username: string) {
        const querySpec = {
            query: 'SELECT * FROM c WHERE c.username = @username',
            parameters: [
                {
                    name: '@username',
                    value: username,
                },
            ],
        };
        const users = await this.find(querySpec);
        return users.at(0) ?? null;
    }

    async findCountUsersByRoleId(roleId: string): Promise<number> {
        const querySpec = {
            query: 'SELECT VALUE COUNT(1) FROM c WHERE c.roleId = @roleId',
            parameters: [
                {
                    name: '@roleId',
                    value: roleId,
                },
            ],
        };
        const { resources } = await this.usersContainer.items.query<number>(querySpec).fetchAll();
        return resources.at(0);
    }
}