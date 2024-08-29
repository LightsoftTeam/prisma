import { Injectable, NotFoundException } from '@nestjs/common';
import type { Container } from '@azure/cosmos';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/azure-database';
import { Product } from './entities/product.entity';
import { ApplicationLoggerService } from 'src/common/services/application-logger.service';
import { FormatCosmosItem } from 'src/common/helpers/format-cosmos-item.helper';
import { FindProductsDto } from './dto/find-products.dto';
import { CategoriesService } from 'src/categories/categories.service';
import { EnterprisesService } from 'src/enterprises/enterprises.service';
import { UnitsService } from 'src/units/units.service';
import { BrandsService } from 'src/brands/brands.service';

@Injectable()
export class ProductsService {

  constructor(
    @InjectModel(Product)
    private readonly productsContainer: Container,
    private readonly logger: ApplicationLoggerService,
    private readonly categoriesService: CategoriesService,
    private readonly enterpriseService: EnterprisesService,
    private readonly unitsService: UnitsService,
    private readonly brandsService: BrandsService,
  ) {
    this.logger.setContext(ProductsService.name);
  }

  async create(createProductDto: CreateProductDto) {
    this.logger.debug(`create product - ${JSON.stringify(createProductDto)}`);
    await this.validateForeignKeys(createProductDto);
    const newProduct: Product = {
      ...createProductDto,
      isActive: true,
      code: await this.generateCode(),
      stock: 0,
      createdAt: new Date(),
    };
    const { resource } = await this.productsContainer.items.create(newProduct);
    return this.toJson(resource);
  }

  async generateCode() {
    const querySpec = {
      query: 'SELECT TOP 1 * FROM c ORDER BY c.code DESC',
    };
    const { resources } = await this.productsContainer.items.query<Product>(querySpec).fetchAll();
    const lastProduct = resources[0];
    if (!lastProduct) {
      return 'P-0001';
    }
    const lastCode = lastProduct.code;
    const newCode = parseInt(lastCode.split('P-')[1]) + 1;
    return 'P-' + newCode.toString().padStart(4, '0');
  }

  async findAll(findProductsDto: FindProductsDto) {
    const { enterpriseId } = findProductsDto
    const querySpec = {
      query: 'SELECT * FROM c where c.enterpriseId = @enterpriseId AND NOT IS_DEFINED(c.deletedAt) ORDER BY c.createdAt DESC',
      parameters: [
        {
          name: '@enterpriseId',
          value: enterpriseId
        }
      ],
    };
    const { resources } = await this.productsContainer.items.query<Product>(querySpec).fetchAll();
    return this.toJson(resources);
  }

  async findOne(id: string) {
    const product = await this.getById(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return this.toJson(product);
  }

  async getById(id: string): Promise<Product | null> {
    this.logger.log(`find product by id ${id}`);
    try {
      const querySpec = {
        query: 'SELECT * FROM c WHERE c.id = @id',
        parameters: [
          {
            name: '@id',
            value: id,
          },
        ],
      };
      const { resources } = await this.productsContainer.items.query<Product>(querySpec).fetchAll();
      return resources.at(0) ?? null;
    } catch (error) {
      this.logger.log(`error getting product by id ${error.message}`);
      return null;
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.getById(id); 
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    await this.validateForeignKeys(updateProductDto);
    const updatedProduct = {
      ...product,
      ...updateProductDto,
      updatedAt: new Date(),
    };
    const { resource } = await this.productsContainer.item(id.toString(), product.enterpriseId).replace(updatedProduct);
    return this.toJson(resource);
  }

  async validateForeignKeys(payload: CreateProductDto | UpdateProductDto) {
    const { brandId, categoryId, enterpriseId, unitId } = payload;
    const map = {
      brand: brandId ? this.brandsService.getById(brandId) : Promise.resolve(true),
      category: categoryId ? this.categoriesService.getById(categoryId) : Promise.resolve(true),
      enterprise: enterpriseId ? this.enterpriseService.getById(enterpriseId) : Promise.resolve(true),
      unit: unitId ? this.unitsService.getById(unitId) : Promise.resolve(true),
    };
    const results = await Promise.all(Object.values(map));
    results.forEach((result, index) => {
      if (!result) {
        const foreignName = Object.keys(map)[index];
        throw new NotFoundException(`${foreignName} not found`);
      }
    });
  }

  async toJson(payload: Product | Product[]) {
    const isArray = Array.isArray(payload);
    let categoryIds = [];
    let products = [];
    if(isArray){
      categoryIds = payload.map(product => product.categoryId);
      products = payload;
    } else {
      categoryIds = [payload.categoryId];
      products = [payload];
    }
    const categories = await this.categoriesService.getByIds(categoryIds);
    console.log(categories.map(category => category.id));
    const formattedProducts = products.map(product => {
      console.log(product.categoryId);
      const category = categories.find(category => category.id === product.categoryId);
      return {
        ...FormatCosmosItem.cleanDocument(product),
        category,
      };
    });
    return isArray ? formattedProducts : formattedProducts[0];
  }

  async remove(id: string) {
    const product = await this.getById(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    const productUpdated = {
      ...product,
      deletedAt: new Date(),
    };
    await this.productsContainer.item(id, product.enterpriseId).replace(productUpdated);
    return null;   
  }
}
