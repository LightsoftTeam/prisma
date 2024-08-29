import { InjectModel } from '@nestjs/azure-database';
import { Injectable, NotFoundException } from '@nestjs/common';
import type { Container } from '@azure/cosmos';
import { Category } from '../entities';
import { ApplicationLoggerService } from 'src/common/services/application-logger.service';
import { Repository } from './repository';

@Injectable()
export class CategoriesRepository extends Repository<Category> {

    constructor(
        @InjectModel(Category) container: Container,
        private readonly logger: ApplicationLoggerService,
    ) {
        super(container);
        this.logger.setContext(CategoriesRepository.name);
    }

    async create(category: Category) {
        const { parentId, enterpriseId } = category;
        if (parentId) {
            this.logger.log(`Parent category id: ${parentId}`);
            const parentCategory = await this.findById(parentId);
            if (!parentCategory) {
                throw new NotFoundException('Parent category not found');
            }
        }
        //TODO: implement this
        // if (enterpriseId) {
        // const enterprise = await this.enterprisesService.getById(enterpriseId);
        // if (!enterprise) {
        //     throw new NotFoundException('Enterprise not found');
        // }
        // }
        return this.create(category);
    }
}