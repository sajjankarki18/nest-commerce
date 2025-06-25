import {
  ConflictException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductRepository } from './repositories/product.repository';
import { ProductDescription } from './entities/product-description.entity';
import { ProductVariant } from './entities/product-variant.entity';
import { ProductVariantRepository } from './repositories/product-variant.repository';
import { ProductDescriptionRepository } from './repositories/product-description.repository';
import { ProductVariantPricing } from './entities/product-variantPricing.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import slugify from 'slugify';
import { StatusEnumType } from 'src/enums/StatusType.enum';
import { In } from 'typeorm';
import { CreateProductVariantDto } from './dto/create-productVariant.dto';
import { UpdateProductVariantDto } from './dto/update-productVariant.dto';
import { CreateProductDescriptionDto } from './dto/create-productDescription.dto';
import { UpdateProductDescriptionDto } from './dto/update-productDescription.dto';
import { ProductVariantPricingRepository } from './repositories/product-variantPricing.repository';
import { ProductImage } from './entities/product-image.entity';
import { ProductImageRepository } from './repositories/product-image.repository';

@Injectable()
export class ProductService {
  constructor(
    private readonly logger: Logger,
    @InjectRepository(Product)
    private readonly productRepository: ProductRepository,
    @InjectRepository(ProductDescription)
    private readonly productDescriptionRepository: ProductDescriptionRepository,
    @InjectRepository(ProductVariant)
    private readonly productVariantRepository: ProductVariantRepository,
    @InjectRepository(ProductVariantPricing)
    private readonly productVariantPricingRepository: ProductVariantPricingRepository,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: ProductImageRepository,
  ) {}

  /* product store-front services */
  async getAllProductsStoreFront({
    page,
    limit,
  }: {
    page: number;
    limit: number;
  }): Promise<{ data: Product[]; page: number; limit: number; total: number }> {
    if (isNaN(Number(page)) || isNaN(Number(limit)) || page < 0 || limit < 0) {
      throw new ConflictException({
        statusCode: HttpStatus.CONFLICT,
        message: ['Page and limit should be of positive integers!'],
        error: 'Conflict',
      });
    }

    const newLimit: number = limit > 10 ? 10 : limit;
    const [products, totalProducts] = await this.productRepository.findAndCount(
      {
        where: {
          status: StatusEnumType.Published,
        },
        skip: (page - 1) * limit,
        take: newLimit,
        order: { created_at: 'desc' },
        select: ['id', 'title', 'slug', 'category_id', 'status'],
      },
    );

    const productsData = await Promise.all(
      products.map(async (product) => {
        /* fetch product_variant */
        const productVariant = await this.productVariantRepository.findOne({
          where: {
            product_id: product?.id,
          },
        });

        /* fetch product_pricing */
        const productPricing =
          await this.productVariantPricingRepository.findOne({
            where: {
              variant_id: productVariant?.id,
            },
          });

        /* fetch product_image */
        const productImage = await this.productImageRepository.findOne({
          where: {
            product_id: product?.id,
          },
        });

        console.log(productImage);

        /* fetch product_pricing */
        return {
          ...product,
          product_pricing: productPricing && {
            selling_price: productPricing.selling_price,
            cross_price: productPricing.crossed_price,
            in_stock: productVariant && productVariant?.in_stock,
          },
          image: productImage && {
            id: productImage?.id,
            product_id: productImage?.product_id,
            image_url: productImage?.image_url,
          },
        };
      }),
    );

    return {
      data: productsData,
      page: page,
      limit: newLimit,
      total: totalProducts,
    };
  }

  /* get products by slug */
  async getProductsBySlug(slug: string) {
    const product = await this.productRepository.findOne({
      where: {
        slug: slug,
        status: StatusEnumType.Published,
      },
      select: [
        'id',
        'title',
        'short_description',
        'slug',
        'status',
        'category_id',
      ],
    });

    if (!product) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: [`Product with ${slug} not found!`],
        error: 'Not Found',
      });
    }

    const [productVariants, productImages] = await Promise.all([
      /* fetch product_variants */
      await this.productVariantRepository.find({
        where: {
          product_id: product?.id,
        },
        select: [
          'id',
          'variant_title',
          'quantity',
          'in_stock',
          'size',
          'color',
        ],
      }),

      /* fetch product_images */
      await this.productImageRepository.find({
        where: {
          product_id: product?.id,
        },
      }),
    ]);

    return {
      ...product,
      variants: productVariants,
      images: productImages,
    };
  }

  /* product-routes */
  /* create a new product */
  async createProduct(productDto: CreateProductDto) {
    try {
      const product = this.productRepository.create({
        title: productDto.title,
        slug: productDto.slug,
        status: productDto.status,
        category_id: productDto.category_id,
      });
      this.logger.log('product has been created!');
      const savedProduct = await this.productRepository.save(product);

      /* creation of slug logic */
      if (savedProduct?.title) {
        const productSlug: string = slugify(savedProduct.title, {
          strict: true,
          lower: true,
        });

        await this.productRepository.update(savedProduct.id, {
          slug: productSlug,
        });
      }

      return await this.productRepository.findOne({
        where: { id: savedProduct.id },
      });
    } catch (error) {
      this.logger.error(
        'some error occurred while creating a new product!',
        error,
      );
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: [
          'some error occurred while creating a new product, please try again!',
        ],
        error: 'Internal Server Error',
      });
    }
  }

  /* get a new product */
  async getProductById(id: string) {
    const product = await this.productRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!product) {
      this.logger.warn('product not found!');
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: [`product with the ${id} not found`],
        error: 'Not Found!',
      });
    }

    this.logger.log('product has been found');
    return product;
  }

  /* get all products */
  async getAllProducts({
    page,
    limit,
    status,
  }: {
    page: number;
    limit: number;
    status?: StatusEnumType;
  }) {
    if (isNaN(Number(page)) || isNaN(Number(limit)) || page < 0 || limit < 0) {
      throw new ConflictException({
        statusCode: HttpStatus.CONFLICT,
        message: ['page and limit should be of positive integers!'],
        error: 'Conflict',
      });
    }

    /* filter logic to filter a product with the status_type */
    let filteredStatus: StatusEnumType | ReturnType<typeof In>;
    if (status?.trim().toLowerCase() === '') {
      filteredStatus = In([StatusEnumType.Published, StatusEnumType.Draft]);
    } else {
      if (status?.trim().toLowerCase() === StatusEnumType.Published) {
        filteredStatus = StatusEnumType.Published;
      } else {
        filteredStatus = StatusEnumType.Draft;
      }
    }

    const newLimit: number = limit > 10 ? 10 : limit;
    const [products, totalProducts] = await this.productRepository.findAndCount(
      {
        where: {
          status: filteredStatus,
        },
        skip: (page - 1) * newLimit,
        take: newLimit,
        order: { created_at: 'desc' },
      },
    );

    this.logger.log(`logger fetched successfully!`);
    return {
      data: products,
      page: page,
      limit: newLimit,
      total: totalProducts,
    };
  }

  /* update a new product */
  async updateProduct(id: string, productDto: UpdateProductDto) {
    const product = await this.getProductById(id);

    try {
      /* create a new slug */
      let productSlug: string = productDto.title;
      if (productDto.title && productDto.title !== product.title) {
        productSlug = slugify(productDto.title, {
          strict: true,
          lower: true,
        });
      }
      await this.productRepository.update(
        { id: id },
        {
          title: productDto.title,
          slug: productSlug,
          status: productDto.status,
          category_id: productDto.category_id,
        },
      );

      this.logger.log('product has been updated!');
      return await this.productRepository.findOne({ where: { id } });
    } catch (error) {
      this.logger.error(
        'some error occurred while updating the product!',
        error,
      );
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: [
          'some error occurred while creating a new product, please try again!',
        ],
        error: 'Internal Server Error',
      });
    }
  }

  /* delete a product */
  async deleteProduct(id: string) {
    await this.getProductById(id);

    try {
      await this.productRepository.delete(id);
      this.logger.log('product has been deleted');
      return {
        id: `${id}`,
        message: `product has been deleted`,
      };
    } catch (error) {
      this.logger.error(
        'some error occurred while deleting the product!',
        error,
      );
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: [
          'some error occurred while deleting a new product, please try again!',
        ],
        error: 'Internal Server Error',
      });
    }
  }

  /* product-variant-routes */
  /* validate the product_id in product_variant */
  async validateProduct(productVariantDto: CreateProductVariantDto) {
    const product = await this.productRepository.findOne({
      where: {
        id: productVariantDto.product_id,
      },
    });

    if (!product) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: [`product with ${productVariantDto.product_id} not found`],
        error: 'product not found',
      });
    }
  }
  /* create a new product_variant */
  async createProductVariant(productVariantDto: CreateProductVariantDto) {
    await this.validateProduct(productVariantDto);
    try {
      const product_variant = this.productVariantRepository.create({
        variant_title: productVariantDto.variant_title,
        quantity: productVariantDto.quantity,
        product_id: productVariantDto.product_id,
        in_stock: productVariantDto.in_stock,
      });

      this.logger.log('product_variant has been added!');
      return await this.productVariantRepository.save(product_variant);
    } catch (error) {
      this.logger.error(
        'some error occurred while creating a new product variant!',
        error,
      );
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: [
          'some error occurred while creating a new product variant, please try again!',
        ],
        error: 'Internal Server Error',
      });
    }
  }

  async getProductVariantById(id: string) {
    const variant = await this.productVariantRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!variant) {
      this.logger.error(`product variant not found`);
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: [`product_variant with ${id} not found!`],
        error: 'Not Found',
      });
    }

    this.logger.log('product_variant has been fetched successfully!');
    return variant;
  }

  async updateProductVariant(
    id: string,
    productVariantDto: UpdateProductVariantDto,
  ) {
    await this.getProductVariantById(id);
    try {
      await this.productVariantRepository.update(
        { id: id },
        {
          variant_title: productVariantDto.variant_title,
          quantity: productVariantDto.quantity,
          in_stock: productVariantDto.in_stock,
          product_id: productVariantDto.product_id,
        },
      );

      this.logger.log('product_variant has been updated successfully!');
      return await this.productVariantRepository.findOne({ where: { id } });
    } catch (error) {
      this.logger.error(
        'some error occurred while updating a new product variant!',
        error,
      );
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: [
          'some error occurred while updating a new product variant, please try again!',
        ],
        error: 'Internal Server Error',
      });
    }
  }

  async deleteProductVariant(id: string) {
    await this.getProductVariantById(id);
    try {
      await this.productVariantRepository.delete(id);
      this.logger.log('product variant has been deleted!');
      return {
        id: `${id}`,
        message: 'product_variant has been deleted',
      };
    } catch (error) {
      this.logger.error(
        'some error occurred while deleting a new product variant!',
        error,
      );
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: [
          'some error occurred while updating a new product variant, please try again!',
        ],
        error: 'Internal Server Error',
      });
    }
  }

  /* product-description-routes */
  /* create a new product_description */
  async createProductDescription(
    productDescriptionDto: CreateProductDescriptionDto,
  ) {
    try {
      const product_description = this.productDescriptionRepository.create({
        description: productDescriptionDto.description,
        product_id: productDescriptionDto.product_id,
      });
      this.logger.log('product_description has been created!');
      return await this.productRepository.save(product_description);
    } catch (error) {
      this.logger.error(
        'some error occurred while creating a new product description!',
        error,
      );
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: [
          'some error occurred while creating a new product description, please try again!',
        ],
        error: 'Internal Server Error',
      });
    }
  }

  async getProductDescriptionById(id: string) {
    const product_description = await this.productDescriptionRepository.findOne(
      {
        where: {
          id: id,
        },
      },
    );

    if (!product_description) {
      this.logger.warn('product_desc not found!');
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: [`product_desc with the ${id} not found`],
        error: 'Not Found!',
      });
    }

    this.logger.log('product_desc has been found');
    return product_description;
  }

  async updateProductDescription(
    id: string,
    productDescriptionDto: UpdateProductDescriptionDto,
  ) {
    await this.getProductDescriptionById(id);

    try {
      await this.productDescriptionRepository.update(
        { id: id },
        {
          description: productDescriptionDto.description,
          product_id: productDescriptionDto.product_id,
        },
      );

      this.logger.log('product_desc has been updated!');
      return await this.productRepository.findOne({ where: { id } });
    } catch (error) {
      this.logger.error(
        'some error occurred while updating the product_description!',
        error,
      );
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: [
          'some error occurred while creating a new product_Description, please try again!',
        ],
        error: 'Internal Server Error',
      });
    }
  }

  async deleteProductDescription(id: string) {
    await this.getProductDescriptionById(id);

    try {
      await this.productDescriptionRepository.delete(id);
      this.logger.log('product_desc has been deleted');
      return {
        id: `${id}`,
        message: `product_desc has been deleted`,
      };
    } catch (error) {
      this.logger.error(
        'some error occurred while deleting the product_desc!',
        error,
      );
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: [
          'some error occurred while deleting a new product_desc, please try again!',
        ],
        error: 'Internal Server Error',
      });
    }
  }
}
