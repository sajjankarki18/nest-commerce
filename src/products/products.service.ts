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
import { CreateProductDto } from './dto/product/create-product.dto';
import slugify from 'slugify';
import { StatusEnumType } from 'src/enums/StatusType.enum';
import { In } from 'typeorm';
import { CreateProductVariantDto } from './dto/product-variant/create-productVariant.dto';
import { CreateProductDescriptionDto } from './dto/product-description/create-productDescription.dto';
import { ProductVariantPricingRepository } from './repositories/product-variantPricing.repository';
import { ProductImage } from './entities/product-image.entity';
import { ProductImageRepository } from './repositories/product-image.repository';
import { UpdateProductDto } from './dto/product/update-product.dto';
import { UpdateProductVariantDto } from './dto/product-variant/update-productVariant.dto';
import { UpdateProductDescriptionDto } from './dto/product-description/update-productDescription.dto';
import { ProductQuestion } from './entities/product-question.dto';
import { ProductQuestionRepository } from './repositories/product-question.repository';
import { AddProductQuestionDto } from './dto/question/add-productQuestion.dto';
import { ReplyProductDto } from './dto/question/reply-productQuestion.dto';
import { ProductHelperService } from './product-helper.service';

@Injectable()
export class ProductService {
  constructor(
    private readonly logger: Logger,
    private readonly productHelperService: ProductHelperService,
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
    @InjectRepository(ProductQuestion)
    private readonly productQuestionRepository: ProductQuestionRepository,
  ) {}

  /* product store-front services */
  async getAllProductsStoreFront({
    page,
    limit,
  }: {
    page: number;
    limit: number;
  }): Promise<{ data: Product[]; page: number; limit: number; total: number }> {
    if (isNaN(Number(page)) || isNaN(Number(limit)) || page < 1 || limit < 1) {
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
        skip: (page - 1) * newLimit,
        take: newLimit,
        order: { created_at: 'desc' },
        select: ['id', 'title', 'slug', 'category_id', 'status'],
      },
    );

    const productsWithPricingDetailAndImage =
      await this.productHelperService.fetchProductPricingDetailsAndImages(
        products,
      );

    this.logger.log(
      `fetched all products-data and their related variant-pricing and images`,
    );
    return {
      data: productsWithPricingDetailAndImage,
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
          'is_availability',
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
      data: {
        ...product,
        variants: productVariants,
        images: productImages,
      },
    };
  }

  /* api to get similar products */
  async getSimilarProducts(slug: string) {
    const product = await this.productRepository.findOne({
      where: {
        slug: slug,
      },
    });

    if (!product) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: [`Product with ${slug} not found!`],
        error: 'Not Found',
      });
    }

    const products = await this.productRepository.find({
      where: {
        category_id: product.category_id,
      },
      select: ['id', 'title', 'slug', 'status', 'category_id'],
    });

    /* fetch product-images using batch query */
    const productImages = await this.productImageRepository.find({
      where: {
        product_id: In(products.map((product) => product.id)),
        is_primary: true,
      },
    });
    const productImageMap = new Map(
      productImages.map((image) => [image.product_id, image]),
    );

    /* fetch product-variant */
    const productVariants = await this.productVariantRepository.find({
      where: {
        product_id: In(products.map((product) => product.id)),
      },
    });
    const productVariantsMap = new Map(
      productVariants.map((variant) => [variant.product_id, variant]),
    );

    /* fetch related product-pricing */
    const productVariantPricing =
      await this.productVariantPricingRepository.find({
        where: {
          variant_id: In(productVariants.map((variant) => variant.id)),
        },
      });
    const productVariantPricingMap = new Map(
      productVariantPricing.map((pricing) => [pricing.variant_id, pricing]),
    );

    /* map through each products and fetch related image and variant-pricing */
    const productsData = products.map((product) => {
      const productImage = productImageMap.get(product?.id);
      const productVariant = productVariantsMap.get(product?.id);
      const productVariantPricing = productVariant
        ? productVariantPricingMap.get(productVariant?.id)
        : null;

      return {
        ...product,
        image: productImage && {
          id: productImage?.id,
          image_url: productImage?.image_url,
          is_primary: productImage?.is_primary,
        },
        pricing: productVariantPricing && {
          id: productVariantPricing?.id,
          selling_price: productVariantPricing?.selling_price,
          crossed_price: productVariantPricing?.crossed_price,
        },
      };
    });

    return {
      data: productsData,
    };
  }

  /* add question service on store-front */
  async addQuestion(
    productId: string,
    productQuestionDto: AddProductQuestionDto,
    customerId: string,
  ) {
    /* check if the product exists */
    await this.getProductById(productId);

    try {
      const question = this.productQuestionRepository.create({
        question: productQuestionDto.question,
        product_id: productId,
        customer_id: customerId,
      });

      await this.productQuestionRepository.save(question);
      return {
        message: 'Your question has been posted successfully!',
      };
    } catch (error) {
      this.logger.error('server error', error);
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: [
          'some error occurred while adding a question, please try again later!',
        ],
        error: 'Internal Server Error',
      });
    }
  }

  /* get all questionfor the products */
  async getAllQuestions({
    page,
    limit,
  }: {
    page: number;
    limit: number;
  }): Promise<{
    data: ProductQuestion[];
    page: number;
    limit: number;
    total: number;
  }> {
    if (isNaN(Number(page)) || isNaN(Number(limit)) || page < 0 || limit < 0) {
      throw new ConflictException({
        statusCode: HttpStatus.CONFLICT,
        message: ['page and limit should be of positive integers'],
        error: 'Conflict',
      });
    }

    const newLimit: number = limit > 10 ? 10 : limit;
    const [questions, totalQuestions] =
      await this.productQuestionRepository.findAndCount({
        skip: (page - 1) * newLimit,
        take: newLimit,
        order: { created_at: 'desc' },
      });

    return {
      data: questions,
      page: page,
      limit: limit,
      total: totalQuestions,
    };
  }

  /* reply service to reply to the product */
  async replyQuestion(
    productId: string,
    replyProductDto: ReplyProductDto,
    admin_user_id: string,
  ) {
    await this.getProductById(productId);
    try {
      await this.productQuestionRepository.update(
        { product_id: productId },
        {
          answer: replyProductDto.reply,
          admin_user_id: admin_user_id,
        },
      );

      return {
        message: 'Reply has been posted!',
      };
    } catch (error) {
      this.logger.error('server error', error);
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: [
          'some error occurred while adding a reply, please try again later!',
        ],
        error: 'Internal Server Error',
      });
    }
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

    const newLimit: number = limit > 10 ? 10 : limit;
    const [products, totalProducts] = await this.productRepository.findAndCount(
      {
        skip: (page - 1) * newLimit,
        take: newLimit,
        order: { created_at: 'desc' },
        select: [
          'id',
          'title',
          'short_description',
          'slug',
          'in_stock',
          'status',
          'created_at',
        ],
      },
    );

    /* throw an empty response if not products found */
    if (products.length === 0) {
      return { message: 'No Products found', data: [] };
    }

    const productsWithQuantityAndImage =
      await this.productHelperService.fetchProductVariantsQuantityAndImages(
        products,
      );

    this.logger.log(`products fetched successfully!`);

    return {
      data: productsWithQuantityAndImage,
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
        is_availability: productVariantDto.is_availability,
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
          is_availability: productVariantDto.is_availability,
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
