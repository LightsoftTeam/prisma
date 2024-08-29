import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/azure-database';
import type { Container } from '@azure/cosmos';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { ApplicationLoggerService } from 'src/common/services/application-logger.service';
import { EnterprisesService } from 'src/enterprises/enterprises.service';
import { FormatCosmosItem } from 'src/common/helpers/format-cosmos-item.helper';
import { FindCategoriesDto } from './dto/find-categories.dto';

@Injectable()
export class CategoriesService {

  constructor(
    @InjectModel(Category)
    private readonly categoriesContainer: Container,
    private readonly logger: ApplicationLoggerService,
    private readonly enterprisesService: EnterprisesService,
  ) { }

  async create(createCategoryDto: CreateCategoryDto) {
    this.logger.log('Creating a new category');
    const { parentId, enterpriseId } = createCategoryDto;
    if (parentId) {
      this.logger.log(`Parent category id: ${parentId}`);
      const parentCategory = await this.getById(parentId);
      if (!parentCategory) {
        throw new NotFoundException('Parent category not found');
      }
    }
    if (enterpriseId) {
      const enterprise = await this.enterprisesService.getById(enterpriseId);
      if (!enterprise) {
        throw new NotFoundException('Enterprise not found');
      }
    }
    const newCategory = {
      ...createCategoryDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.logger.log(`New category: ${JSON.stringify(newCategory)}`);
    const { resource } = await this.categoriesContainer.items.create(newCategory);
    return this.fill(resource);
  }

  async getById(id: string): Promise<Category | null> {
    try {
      this.logger.log(`Getting category by id: ${id}`);
      const querySpec = {
        query: 'SELECT * FROM c WHERE c.id = @id',
        parameters: [{ name: '@id', value: id }],
      };
      const { resources } = await this.categoriesContainer.items.query<Category>(querySpec).fetchAll();
      return resources[0] ?? null;
    } catch (error) {
      return null;
    }
  }

  async getByIds(ids: string[]) {
    this.logger.log(`Getting categories by ids: ${ids.join(', ')}`);
    const querySpec = {
      query: 'SELECT * FROM c WHERE ARRAY_CONTAINS(@ids, c.id)',
      parameters: [{ name: '@ids', value: ids }],
    };
    const { resources: categories } = await this.categoriesContainer.items.query<Category>(querySpec).fetchAll();
    return categories.map(c => FormatCosmosItem.cleanDocument(c));
  }

  async findAll({ enterpriseId }: FindCategoriesDto) {
    this.logger.log(`Getting all categories - ${enterpriseId}`);
    const querySpec = {
      query: 'SELECT * FROM c WHERE c.enterpriseId = @enterpriseId AND NOT IS_DEFINED(c.deletedAt)',
      parameters: [{ name: '@enterpriseId', value: enterpriseId }],
    };
    const { resources: categories } = await this.categoriesContainer.items.query<Category>(querySpec).fetchAll();
    return this.flattenCategories(categories);
  }

  async findOne(id: string) {
    const category = await this.getById(id);
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return this.fill(category);
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    this.logger.log(`Updating category by id: ${id}`);
    const category = await this.getById(id);
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    const updatedCategory = {
      ...category,
      ...updateCategoryDto,
      updatedAt: new Date(),
    };
    this.logger.log(`Updated category: ${JSON.stringify(updatedCategory)}`);
    const { resource } = await this.categoriesContainer.item(id, category.enterpriseId).replace(updatedCategory);
    return this.fill(resource);
  }

  async remove(id: string) {
    this.logger.log(`Deleting category by id: ${id}`);
    const category = await this.getById(id);
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    const deletedCategory = {
      ...category,
      deletedAt: new Date(),
    };
    this.logger.log(`Deleted category: ${JSON.stringify(deletedCategory)}`);
    await this.categoriesContainer.item(id, category.enterpriseId).replace(deletedCategory);
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
    const relatedCategories = [];
    let selectedCategory = category;
    while (selectedCategory.parentId) {
      console.log('parent founded: ', selectedCategory.parentId);
      const parentCategory = await this.getById(selectedCategory.parentId);
      if (parentCategory) {
        relatedCategories.push(parentCategory);
        selectedCategory = parentCategory;
      }
    }
    return this.flattenCategories([category, ...relatedCategories]).find((c: Partial<Category>) => c.id === category.id);
  }
}
