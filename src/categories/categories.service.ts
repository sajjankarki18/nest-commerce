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
import { Product } from 'src/products/entities/product.entity';
import { ProductRepository } from 'src/products/repositories/product.repository';
import { ProductVariant } from 'src/products/entities/product-variant.entity';
import { ProductVariantRepository } from 'src/products/repositories/product-variant.repository';
import { ProductVariantPricing } from 'src/products/entities/product-variantPricing.entity';
import { ProductImage } from 'src/products/entities/product-image.entity';
import { ProductImageRepository } from 'src/products/repositories/product-image.repository';
import { ProductVariantPricingRepository } from 'src/products/repositories/product-variantPricing.repository';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: CategoryRepository,
    @InjectRepository(Product)
    private readonly productRepository: ProductRepository,
    @InjectRepository(ProductVariant)
    private readonly productVariantRepository: ProductVariantRepository,
    @InjectRepository(ProductVariantPricing)
    private readonly productVariantPricingRepository: ProductVariantPricingRepository,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: ProductImageRepository,
    private readonly logger: Logger,
  ) {}

  /* store-front service to get all parent-categories to display at home page */
  async getAllParentCategories(): Promise<{ data: Category[]; total: number }> {
    try {
      const [parentCategories, totalParentCategories] =
        await this.categoryRepository.findAndCount({
          where: {
            parent_id: IsNull(),
            status: StatusEnumType.Published,
          },
        });

      this.logger.log(`fetched all parent-categories`);
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

  async fetchCategory(id: string): Promise<Category[]> {
    const category = await this.categoryRepository.find({
      where: {
        status: StatusEnumType.Published,
        parent_id: id,
      },
      select: ['id', 'parent_id', 'name', 'description', 'slug'],
    });

    return category;
  }

  /* get all categories for store front with the related sub categories */
  async getAllCategoriesForStore() {
    try {
      /* fetch the first level categories */
      const firstLevelCategories = await this.categoryRepository.find({
        where: {
          status: StatusEnumType.Published,
          parent_id: IsNull(),
        },
        select: ['id', 'parent_id', 'name', 'description', 'slug'],
      });

      /* fetch the sub_categoreis of first_level */
      const categoriesData = await Promise.all(
        firstLevelCategories.map(async (firstLevelCategory) => {
          /* fetch the second level categories */
          const secondLevelCategories = await this.fetchCategory(
            firstLevelCategory?.id,
          );

          /* fetch the third level categories */
          const mappedSecondLevelSubCategories = await Promise.all(
            secondLevelCategories.map(async (secondLevelCategory) => {
              const thirdLevelCategories = await this.fetchCategory(
                secondLevelCategory?.id,
              );

              return {
                ...secondLevelCategory,
                third_level: thirdLevelCategories,
              };
            }),
          );

          return {
            ...firstLevelCategory,
            second_level: mappedSecondLevelSubCategories,
          };
        }),
      );

      return {
        data: categoriesData,
      };
    } catch (error) {
      this.logger.log(
        'error occurred while fetching category and their sub-categories',
        error,
      );
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: [
          'some error occurred while fetching the category, please try again!',
        ],
        error: 'Internal Server Error',
      });
    }
  }

  /* get all related products by category slug */
  async getAllCategoryProductsBySlug(slug: string) {
    const category = await this.categoryRepository.findOne({
      where: {
        slug: slug,
      },
    });

    if (!category) {
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: [`category with slug ${slug} not found!`],
        error: 'Not Found',
      });
    }

    const products = await this.productRepository.find({
      where: {
        category_id: category?.id,
        status: StatusEnumType.Published,
      },
      select: ['id', 'title', 'short_description', 'slug', 'category_id'],
    });

    /* fetch those products by category slug */
    /* fetch product-variants */
    const productVariants = await this.productVariantRepository.find({
      where: {
        product_id: In(products.map((product) => product.id)),
      },
    });
    const mapProductVariants = new Map(
      productVariants.map((variant) => [variant.product_id, variant]),
    );

    /* fetch product-pricing */
    const productVariantsPricing =
      await this.productVariantPricingRepository.find({
        where: {
          variant_id: In(productVariants.map((variant) => variant.id)),
        },
      });
    const mapProductVariantsPricing = new Map(
      productVariantsPricing.map((variantPricing) => [
        variantPricing.variant_id,
        variantPricing,
      ]),
    );

    /* fetch product-images */
    const productImages = await this.productImageRepository.find({
      where: {
        product_id: In(products.map((product) => product.id)),
        is_primary: true,
      },
    });
    const mapProductImages = new Map(
      productImages.map((image) => [image.product_id, image]),
    );

    /* map through each products and fetch their related product_images and variants */
    const productsData = products.map((product) => {
      const variant = mapProductVariants.get(product?.id);
      const pricing = variant
        ? mapProductVariantsPricing.get(variant?.id)
        : null;
      const image = mapProductImages.get(product?.id);

      return {
        ...product,
        product_pricing: pricing && {
          id: pricing?.id,
          selling_price: pricing?.selling_price,
          crossed_price: pricing?.crossed_price,
        },
        image: image && {
          id: image?.id,
          image_url: image?.image_url,
          is_primary: image?.is_primary,
        },
      };
    });

    return {
      data: productsData,
    };
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
  async createCategory(
    categoryDto: CreateCategoryDto,
  ): Promise<Category | null> {
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

  async updateCategory(
    id: string,
    categoryDto: UpdateCategoryDto,
  ): Promise<Category | null> {
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
  async deleteCategory(id: string): Promise<{ id: string; message: string }> {
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
