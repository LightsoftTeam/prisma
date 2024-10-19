import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from '../domain/entities/product.entity';
import { ApplicationLoggerService } from 'src/common/services/application-logger.service';
import { FormatCosmosItem } from 'src/common/helpers/format-cosmos-item.helper';
import { ProductsRepository } from 'src/domain/repositories/products.repository';
import { CategoriesRepository } from '../domain/repositories/categories.repository';
import { REQUEST } from '@nestjs/core';

@Injectable()
export class ProductsService {

  constructor(
    private readonly productsRepository: ProductsRepository,
    private readonly logger: ApplicationLoggerService,
    private readonly categoriesRepository: CategoriesRepository,
    @Inject(REQUEST) private readonly request: any,
  ) {
    this.logger.setContext(ProductsService.name);
  }

  async create(createProductDto: CreateProductDto) {
    this.logger.debug(`create product - ${JSON.stringify(createProductDto)}`);
    const newProduct: Product = {
      ...createProductDto,
      enterpriseId: this.request.enterpriseId,
      isActive: true,
      code: await this.productsRepository.getLastCode(),
      stock: 0,
      createdAt: new Date(),
    };
    return this.productsRepository.create(newProduct);
  }

  async findAll() {
    const products = await this.productsRepository.findByEnterpriseId(this.request.enterpriseId);
    return this.toJson(products);
  }

  async findOne(id: string) {
    const product = await this.productsRepository.findById(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return this.toJson(product);
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.productsRepository.findById(id);
    const updateproduct = {
      ...product,
      ...updateProductDto,
    }
    return this.productsRepository.update(id, updateproduct);
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
    const categories = await this.categoriesRepository.findByIds(categoryIds);
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
    return this.productsRepository.delete(id);
  }
}
