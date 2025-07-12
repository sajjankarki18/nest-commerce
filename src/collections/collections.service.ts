import {
  ConflictException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CollectionRepository } from './repositories/collection.repository';
import { CollectionRedirect } from './entities/collection-redirect.entity';
import { CollectionRedirectRepository } from './repositories/collection-redirect.repository';
import { Collection } from './entities/collection.entity';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { CreateCollectionRedirectDto } from './dto/create-collectionRedirect.dto';
import slugify from 'slugify';
import { StatusEnumType } from 'src/enums/StatusType.enum';
import { Product } from 'src/products/entities/product.entity';
import { ProductRepository } from 'src/products/repositories/product.repository';
import { ProductVariant } from 'src/products/entities/product-variant.entity';
import { ProductVariantRepository } from 'src/products/repositories/product-variant.repository';
import { ProductVariantPricing } from 'src/products/entities/product-variantPricing.entity';
import { ProductImage } from 'src/products/entities/product-image.entity';
import { ProductImageRepository } from 'src/products/repositories/product-image.repository';
import { ProductVariantPricingRepository } from 'src/products/repositories/product-variantPricing.repository';
import { CollectionRedirectTypeEnum } from './types/collection-redirectType.enum';
import { In } from 'typeorm';

@Injectable()
export class CollectionsService {
  constructor(
    @InjectRepository(Collection)
    private readonly collectionRepository: CollectionRepository,
    @InjectRepository(CollectionRedirect)
    private readonly collectionRedirectRepository: CollectionRedirectRepository,
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

  /* frontend services */
  /* helper method for get collection by slug */
  async getMappedProductData(products: Product[]) {
    const productIds: string[] = products.map((product) => product.id);

    /* fetch product-variants data */
    const productVariants = await this.productVariantRepository.find({
      where: {
        product_id: In(productIds),
      },
    });

    const mappedProductVariants = new Map(
      productVariants.map((productVariant) => [
        productVariant.product_id,
        productVariant,
      ]),
    );

    const productVariantIds: string[] = productVariants.map(
      (productvariant) => productvariant.id,
    );

    /* fetch product-variant pricing */
    const productVariantPricing =
      await this.productVariantPricingRepository.find({
        where: {
          variant_id: In(productVariantIds),
        },
      });

    const mappedProductVariantPricing = new Map(
      productVariantPricing.map((productVariantPricing) => [
        productVariantPricing.variant_id,
        productVariantPricing,
      ]),
    );

    /* fetch product-images */
    const productImages = await this.productImageRepository.find({
      where: {
        product_id: In(productIds),
      },
    });

    const mappedProductImages = new Map(
      productImages.map((productImage) => [
        productImage.product_id,
        productImage,
      ]),
    );

    return products.map((product) => {
      const productVariant = mappedProductVariants.get(product.id);
      const productVariantPricing = productVariant
        ? mappedProductVariantPricing.get(productVariant.id)
        : null;
      const productImage = mappedProductImages.get(product.id);

      return {
        ...product,
        image: productImage && {
          id: productImage?.id,
          image_url: productImage?.image_url,
          is_primary: productImage?.is_primary,
        },
        product_pricing: productVariantPricing && {
          id: productVariantPricing?.id,
          selling_price: productVariantPricing?.selling_price,
          crossed_price: productVariantPricing?.crossed_price,
        },
      };
    });
  }
  /* get collections by slug */
  async getCollectionsBySlug(slug: string) {
    /* fetch the product-collection first and if not exists, throw an not fount exception */
    const collection = await this.collectionRepository.findOne({
      where: {
        slug: slug,
        status: StatusEnumType.Published,
      },
    });

    if (!collection) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: [`collection with slug ${slug} not found!`],
        error: 'Not Found',
      });
    }

    const collectionRedirects = await this.collectionRedirectRepository.find({
      where: {
        collection_id: collection.id,
      },
    });

    const redirectIds: string[] = collectionRedirects.map(
      (redirect) => redirect.redirect_id,
    );

    const productsData = await Promise.all(
      collectionRedirects.map(async (redirect) => {
        const products: Product[] = [];

        /* fetch product-related collections */
        if (CollectionRedirectTypeEnum.Product === redirect.redirect_type) {
          const collectionProduct = await this.productRepository.findOne({
            where: {
              id: In(redirectIds),
              status: StatusEnumType.Published,
            },
            select: ['id', 'title', 'slug', 'category_id'],
          });
          if (collectionProduct) {
            products.push(collectionProduct);
          }
        } else if (
          /* fetch category-related collections */
          CollectionRedirectTypeEnum.Category === redirect.redirect_type
        ) {
          const collectionProducts = await this.productRepository.find({
            where: {
              status: StatusEnumType.Published,
              category_id: In(redirectIds),
            },
            select: ['id', 'title', 'slug', 'category_id'],
          });

          products.push(...collectionProducts);
        }

        const mappedProductsData = await this.getMappedProductData(products);
        return mappedProductsData;
      }),
    );

    return {
      data: productsData.flat(),
    };
  }

  /* portal services */
  async createCollection(
    collectionDto: CreateCollectionDto,
  ): Promise<Collection | null> {
    try {
      const collection = this.collectionRepository.create({
        title: collectionDto.title,
        slug: collectionDto.slug,
        image_url: collectionDto.image_url,
        status: collectionDto.status,
      });
      const savedCollection = await this.collectionRepository.save(collection);

      /* create a new slug for each collection while saving it */
      if (savedCollection?.title) {
        const updatedCollectionSlug: string = slugify(savedCollection.title, {
          strict: true,
          lower: true,
        });

        await this.collectionRepository.update(savedCollection.id, {
          slug: updatedCollectionSlug,
        });
      }

      return await this.collectionRepository.findOne({
        where: {
          id: savedCollection.id,
        },
      });
    } catch (error) {
      this.logger.error(
        'some error occurred while creating the banner!',
        error,
      );
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: [
          'some error occurred while creating a collection, please try again!',
        ],
        error: 'Internal Server Error',
      });
    }
  }

  async getCollectionById(id: string): Promise<Collection> {
    const collection = await this.collectionRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!collection) {
      this.logger.error('collection not found!');
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: [`collection with ${id} not found`],
        error: 'Not Found',
      });
    }

    this.logger.log('collection fetched successfully!');
    return collection;
  }

  async getAllCollections({
    page,
    limit,
  }: {
    page: number;
    limit: number;
  }): Promise<{
    data: Collection[];
    page: number;
    limit: number;
    total: number;
  }> {
    try {
      if (
        isNaN(Number(page)) ||
        isNaN(Number(limit)) ||
        page < 0 ||
        limit < 0
      ) {
        throw new ConflictException({
          statusCode: HttpStatus.NOT_FOUND,
          message: ['page and limit should be of positive integers!'],
          error: 'Conflict',
        });
      }

      const newLimit: number = limit > 10 ? 10 : limit;
      const [collections, totalCollections] =
        await this.collectionRepository.findAndCount({
          skip: (page - 1) * newLimit,
          take: newLimit,
          order: { created_at: 'desc' },
        });

      this.logger.log('banners fetched successfully!');
      return {
        data: collections,
        page: page,
        limit: newLimit,
        total: totalCollections,
      };
    } catch (error) {
      this.logger.error(
        'some error occurred while fetching the banners!',
        error,
      );
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: [
          'some error occurred while fetching all banners, please try again!',
        ],
        error: 'Internal Server Error',
      });
    }
  }

  async updateCollection(id: string, collectionDto: UpdateCollectionDto) {
    await this.getCollectionById(id);

    try {
      await this.collectionRepository.update(
        { id },
        {
          title: collectionDto.title,
          slug: collectionDto.slug,
          image_url: collectionDto.image_url,
          status: collectionDto.status,
        },
      );

      this.logger.log('collectionhas been updated!');
      return await this.collectionRepository.findOne({
        where: { id },
      });
    } catch (error) {
      this.logger.error(
        'some error occurred while updating the banner!',
        error,
      );
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: [
          'some error occurred while updating a banner, please try again!',
        ],
        error: 'Internal Server Error',
      });
    }
  }

  async deleteCollection(id: string): Promise<{ id: string; message: string }> {
    await this.getCollectionById(id);

    try {
      await this.collectionRepository.delete(id);
      this.logger.log('collectionhas been deleted!');
      return {
        id: `${id}`,
        message: 'collection deleted successfully!',
      };
    } catch (error) {
      this.logger.error(
        'some error occurred while deleting the banner!',
        error,
      );
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: [
          'some error occurred while deleting a banner, please try again!',
        ],
        error: 'Internal Server Error',
      });
    }
  }

  /* redirect services */

  /* validate a new collection-redirect */
  async validateCollectionData(collectionId: string) {
    const collection = await this.collectionRepository.findOne({
      where: {
        id: collectionId,
      },
    });

    if (!collection) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: [`collection with ${collectionId} not found!`],
        error: 'Not Found',
      });
    }
  }

  async createCollectionRedirect(
    collectionRedirectDto: CreateCollectionRedirectDto,
  ) {
    await this.validateCollectionData(collectionRedirectDto.collection_id);
    try {
      const collectionRedirect = this.collectionRedirectRepository.create({
        collection_id: collectionRedirectDto.collection_id,
        redirect_id: collectionRedirectDto.redirect_id,
        redirect_type: collectionRedirectDto.redirect_type,
      });

      this.logger.log('created new collection-redirect');
      return await this.collectionRedirectRepository.save(collectionRedirect);
    } catch (error) {
      this.logger.error(
        'some error occurred while creating a new collection-redirect',
        error,
      );
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: [
          'some error occurred while creating a new collection-redirect, please try again!',
        ],
        error: 'Internal Server Error',
      });
    }
  }

  async getCollectionRedirectById(id: string) {
    const redirect = await this.collectionRedirectRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!redirect) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: [`redirect with ${id} not found!`],
        error: 'Not Found',
      });
    }

    return redirect;
  }

  async updateCollectionRedirect(
    id: string,
    collectionRedirectDto: CreateCollectionRedirectDto,
  ) {
    /* validate the collection-redirect */
    await this.getCollectionRedirectById(id);
    try {
      await this.collectionRedirectRepository.update(
        { id },
        {
          collection_id: collectionRedirectDto.collection_id,
          redirect_id: collectionRedirectDto.redirect_id,
          redirect_type: collectionRedirectDto.redirect_type,
        },
      );

      return await this.collectionRedirectRepository.findOne({ where: { id } });
    } catch (error) {
      this.logger.error(
        'some error occurred while updating a collection-redirect',
        error,
      );
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: [
          'some error occurred while updating a collection, please try again!',
        ],
        error: 'Internal Server Error',
      });
    }
  }

  async deleteCollectionRedirect(
    id: string,
  ): Promise<{ id: string; message: string }> {
    await this.getCollectionRedirectById(id);
    try {
      await this.collectionRedirectRepository.delete(id);
      return {
        id: `${id}`,
        message: `collection-redirect deleted`,
      };
    } catch (error) {
      this.logger.error(
        'some error occurred while deleting a collection-redirect',
        error,
      );
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: [
          'some error occurred while deleting a collection, please try again!',
        ],
        error: 'Internal Server Error',
      });
    }
  }
}
