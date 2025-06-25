import {
  ConflictException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { CategoryRepository } from './repositories/category.repository';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { StatusEnumType } from 'src/enums/StatusType.enum';
import slugify from 'slugify';
import { In, IsNull } from 'typeorm';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: CategoryRepository,
    private readonly logger: Logger,
  ) {}

  /* store-front service to get all parent-categories to display at home page */
  async getAllParentCategories() {
    try {
      const [parentCategories, totalParentCategories] =
        await this.categoryRepository.findAndCount({
          where: {
            parent_id: IsNull(),
            status: StatusEnumType.Published,
          },
        });

      return {
        data: parentCategories,
        total: totalParentCategories,
      };
    } catch (error) {
      this.logger.error(
        'some error occurred while fetching parent_categories!',
        error,
      );
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: [
          `some error occurred while fetching parent_categories, please try again`,
        ],
        error: 'Internal Server Error',
      });
    }
  }

  /* category heirarchy updation logic */
  async categoryHeirarchyUpdation(
    categoryDto: CreateCategoryDto,
  ): Promise<void> {
    if (categoryDto?.parent_id) {
      const child_category = await this.categoryRepository.findOne({
        where: {
          id: categoryDto.parent_id,
        },
      });

      if (child_category?.parent_id) {
        const parent_category = await this.categoryRepository.findOne({
          where: {
            id: child_category.parent_id,
          },
        });

        if (parent_category?.parent_id) {
          const grand_parent_category = await this.categoryRepository.findOne({
            where: {
              id: parent_category.parent_id,
            },
          });

          if (grand_parent_category) {
            this.logger.warn(`category can be updated only upto three levels!`);
            throw new ConflictException({
              statusCode: HttpStatus.CONFLICT,
              message: ['category can be only updated upto three levels!'],
              error: 'Conflict',
            });
          }
        }
      }
    }
  }
  /* create a new category */
  async createCategory(categoryDto: CreateCategoryDto) {
    try {
      const category = this.categoryRepository.create({
        parent_id: categoryDto.parent_id,
        description: categoryDto.description,
        name: categoryDto.name,
        status: categoryDto.status,
      });

      const savedCategory = await this.categoryRepository.save(category);

      /* slug functionality */
      if (savedCategory?.name) {
        const categorySlug: string = slugify(savedCategory.name, {
          strict: true,
          lower: true,
        });
        await this.categoryRepository.update(savedCategory.id, {
          slug: categorySlug,
        });
      }

      this.logger.log('category has been created!');
      return await this.categoryRepository.findOne({
        where: { id: savedCategory.id },
      });
    } catch (error) {
      this.logger.error(
        'some error occurred while creating the category!',
        error,
      );
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: [
          'some error occurred while creating a new category, please try again!',
        ],
        error: 'Internal Server Error',
      });
    }
  }

  /* fetch all categories - pagination feature */
  async getAllCategories({
    page,
    limit,
    status,
  }: {
    page: number;
    limit: number;
    status?: StatusEnumType;
  }): Promise<{
    data: Category[];
    page: number;
    limit: number;
    total: number;
  }> {
    if (isNaN(Number(page)) || isNaN(Number(limit)) || page < 0 || limit < 0) {
      this.logger.error('page and limit should be of positive integers!');
      throw new ConflictException({
        statusCode: HttpStatus.CONFLICT,
        message: ['page and limit must be of positive integers!'],
        error: 'Conflict',
      });
    }

    /* filter logic for filtering a category by status */
    let filterStatus: StatusEnumType | ReturnType<typeof In>;
    if (status?.trim().toLowerCase() === '') {
      filterStatus = In([StatusEnumType.Published, StatusEnumType.Draft]);
    } else {
      if (status?.trim().toLowerCase() === StatusEnumType.Published) {
        filterStatus = StatusEnumType.Published;
      } else {
        filterStatus = StatusEnumType.Draft;
      }
    }
    const newLimit: number = limit > 10 ? 10 : limit;
    const [categories, totalCategories] =
      await this.categoryRepository.findAndCount({
        where: {
          status: filterStatus,
        },
        skip: (page - 1) * newLimit,
        take: newLimit,
        order: { created_at: 'desc' },
      });

    this.logger.log('categories fetched successfully!');
    return {
      data: categories,
      page: page,
      limit: newLimit,
      total: totalCategories,
    };
  }

  async getCategoryById(id: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!category) {
      this.logger.error('category not found!');
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: [`category with ${id} not found!`],
        error: 'Not Found',
      });
    }

    this.logger.log('categories fetched successfully');
    return category;
  }

  async updateCategory(id: string, categoryDto: UpdateCategoryDto) {
    const category = await this.getCategoryById(id);

    /* here comes the logic to update the limit the category heirarchy upto three levels */
    await this.categoryHeirarchyUpdation(categoryDto);

    /* generate a new slug for the category name */
    let updatedCategorySlug: string = category?.name;
    if (categoryDto.name && category.name !== categoryDto.name) {
      updatedCategorySlug = slugify(categoryDto.name, {
        lower: true,
        strict: true,
      });
    }

    /* update the category wuth the category_id */
    await this.categoryRepository.update(
      { id },
      {
        parent_id: categoryDto.parent_id,
        name: categoryDto.name,
        description: categoryDto.description,
        slug: updatedCategorySlug,
        status: categoryDto.status,
      },
    );

    this.logger.log(`category has been updated!`);
    return await this.categoryRepository.findOne({ where: { id } });
  }

  /* delete a category */
  async deleteCategory(id: string) {
    const category = await this.getCategoryById(id);

    /* deletion logic for the parent-child heirachy */
    /* if a parent_id is null, it is the top heirachy of the category (parent_category) */
    /*
    note: 
    case_1: If the parent category has existing child categories within it, you should not allow to delete the parent
    case_1: if the parent category has not child categories within it, you are allowed to delete it
    */
    if (category.parent_id === null) {
      /* now check weather the parent has existing child_categories */
      const child_categories = await this.categoryRepository.find({
        where: {
          parent_id: category.id,
        },
      });

      /* if it does, then restrict deleting it */
      if (child_categories.length > 0) {
        this.logger.warn(
          `cannot delete category, child categories exists within it!`,
        );
        throw new ConflictException({
          statusCode: HttpStatus.CONFLICT,
          message: [
            'category cannot not be deleted, it has existing child categories!',
          ],
          error: 'Conflict',
        });
      }
    } else if (category.parent_id !== null) {
      /* check-2 is also check those categories with the parent_id and checkout weather they have sub categories */
      const grand_child_categories = await this.categoryRepository.find({
        where: {
          parent_id: category.id,
        },
      });

      if (grand_child_categories.length > 0) {
        this.logger.warn(
          `cannot delete category, child categories exists within it!`,
        );
        throw new ConflictException({
          statusCode: HttpStatus.CONFLICT,
          message: [
            'category cannot be deleted, it has existing child categories!',
          ],
          error: 'Conflict',
        });
      }
    }
    /* if no condition matches i.e if no category has existing child within it, just allow deleting it */
    await this.categoryRepository.delete(id);
    this.logger.log('category has been deleted!');
    return {
      id: `${id}`,
      message: 'category deleted successfully!',
    };
  }
}
