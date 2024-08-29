import { InjectModel } from '@nestjs/azure-database';
import { Injectable, NotFoundException } from '@nestjs/common';
import type { Container } from '@azure/cosmos';
import { Product } from '../entities';
import { ApplicationLoggerService } from 'src/common/services/application-logger.service';
import { Repository } from './repository';
import { BrandsRepository } from './brands.repository';
import { CategoriesRepository } from './categories.repository';
import { EnterprisesRepository } from './enterprises.repository';
import { UnitsRepository } from './units.repository';
@Injectable()
export class ProductsRepository extends Repository<Product> {
    constructor(
        @InjectModel(Product) container: Container,
        private readonly logger: ApplicationLoggerService,
        private readonly brandsRepository: BrandsRepository,
        private readonly categoriesRepository: CategoriesRepository,
        private readonly enterprisesRepository: EnterprisesRepository,
        private readonly unitsRepository: UnitsRepository,
    ) {
        super(container);
        this.logger.setContext(ProductsRepository.name);
    }

    create(product: Product) {
        this.validateForeignKeys(product);
        return super.create(product);
    }

    update(id: string, product: Partial<Product>) {
        this.validateForeignKeys(product);
        return super.update(id, product);
    }

    async getLastCode() {
        //TODO: the code might be unique, move this to create method
        const querySpec = {
            query: 'SELECT TOP 1 * FROM c ORDER BY c.code DESC',
        };
        const resources = await this.find(querySpec);
        const lastProduct = resources[0];
        if (!lastProduct) {
            return 'P-0001';
        }
        const lastCode = lastProduct.code;
        const newCode = parseInt(lastCode.split('P-')[1]) + 1;
        return 'P-' + newCode.toString().padStart(4, '0');
    }

    private async validateForeignKeys(product: Partial<Product>) {
        const { brandId, categoryId, enterpriseId, unitId } = product;
        const map = {
          brand: brandId ? this.brandsRepository.findById(brandId) : Promise.resolve(true),
          category: categoryId ? this.categoriesRepository.findById(categoryId) : Promise.resolve(true),
          enterprise: enterpriseId ? this.enterprisesRepository.findById(enterpriseId) : Promise.resolve(true),
          unit: unitId ? this.unitsRepository.findById(unitId) : Promise.resolve(true),
        };
        const results = await Promise.all(Object.values(map));
        results.forEach((result, index) => {
          if (!result) {
            const foreignName = Object.keys(map)[index];
            throw new NotFoundException(`${foreignName} not found`);
          }
        });
      }
}