import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from '../domain/entities/category.entity';
import { ApplicationLoggerService } from 'src/common/services/application-logger.service';
import { FormatCosmosItem } from 'src/common/helpers/format-cosmos-item.helper';
import { CategoriesRepository } from 'src/domain/repositories/categories.repository';
import { REQUEST } from '@nestjs/core';

@Injectable()
export class CategoriesService {

  constructor(
    private readonly categoriesRepository: CategoriesRepository,
    private readonly logger: ApplicationLoggerService,
    @Inject(REQUEST) private readonly request: any,
  ) { }

  async create(createCategoryDto: CreateCategoryDto) {
    this.logger.log('Creating a new category');
    const category: Category = {
      ...createCategoryDto,
      enterpriseId: this.request.enterpriseId,
      createdAt: new Date(),
    }
    const newCategory = await this.categoriesRepository.create(category);
    this.logger.log(`Category created: ${JSON.stringify(newCategory)}`);
    return this.fill(newCategory);
  }

  async findAll() {
    const categories = await this.categoriesRepository.findByEnterpriseId(this.request.enterpriseId);
    return this.flattenCategories(categories);
  }

  async findOne(id: string) {
    const category = await this.categoriesRepository.findById(id);
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return this.fill(category);
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    this.logger.log(`Updating category by id: ${id}`);
    const updatedCategory = await this.categoriesRepository.update(id, updateCategoryDto);
    return this.fill(updatedCategory);
  }

  async remove(id: string) {
    this.logger.log(`Deleting category by id: ${id}`);
    await this.categoriesRepository.delete(id);
    return null;
  }

  private flattenCategories(categories: Category[]) {
    const categoryMap = new Map();
    categories.forEach(category => categoryMap.set(category.id, category));

    function findLevel(categoryId: string, level = 0) {
      const category = categoryMap.get(categoryId);
      if (category && category.parentId) {
        return findLevel(category.parentId, level + 1);
      }
      return level;
    }

    function buildFullName(categoryId: string) {
      const category = categoryMap.get(categoryId);
      if (category && category.parentId) {
        const parentFullName = buildFullName(category.parentId);
        return `${parentFullName} - ${category.name}`;
      }
      return category ? category.name : '';
    }

    // Función para aplanar la estructura con los hijos debajo de los padres
    function flattenAndSort(parentId = null) {
      return categories
        .filter(category => category.parentId === parentId)
        .sort((a, b) => a.name.localeCompare(b.name)) // Orden opcional por nombre o cualquier otra propiedad
        .map(category => {
          const currentLevel = findLevel(category.id);
          const fullName = buildFullName(category.id);
          return [
            {
              ...FormatCosmosItem.cleanDocument(category),
              fullName,
              level: currentLevel,
              parentId: category.parentId || null
            },
            ...flattenAndSort(category.id)
          ];
        })
        .flat();
    }

    return flattenAndSort();
  }

  async fill(category: Category) {
    this.logger.debug(`Filling category ${category.id}`);
    const relatedCategories = [];
    let selectedCategory = category;
    while (selectedCategory.parentId) {
      this.logger.debug(`parent founded: ${selectedCategory.parentId}`);
      console.log('parent founded: ', selectedCategory.parentId);
      const parentCategory = await this.findOne(selectedCategory.parentId);
      if (parentCategory) {
        relatedCategories.push(parentCategory);
        selectedCategory = parentCategory;
      }
    }
    const flattenCategories = this.flattenCategories([category, ...relatedCategories]).find((c: Partial<Category>) => c.id === category.id);
    this.logger.debug(`Category filled: ${JSON.stringify(flattenCategories)}`);
    if(!flattenCategories) {
      return category;
    }
    return flattenCategories;
  }
}