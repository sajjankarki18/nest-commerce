import { Logger } from '@nestjs/common';
import { CollectionRepository } from './repositories/collection.repository';
import { CollectionRedirect } from './entities/collection-redirect.entity';
import { CollectionRedirectRepository } from './repositories/collection-redirect.repository';
import { Collection } from './entities/collection.entity';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { CreateCollectionRedirectDto } from './dto/create-collectionRedirect.dto';
import { StatusEnumType } from 'src/enums/StatusType.enum';
import { Product } from 'src/products/entities/product.entity';
import { ProductRepository } from 'src/products/repositories/product.repository';
import { ProductVariant } from 'src/products/entities/product-variant.entity';
import { ProductVariantRepository } from 'src/products/repositories/product-variant.repository';
import { ProductImage } from 'src/products/entities/product-image.entity';
import { ProductImageRepository } from 'src/products/repositories/product-image.repository';
import { ProductVariantPricingRepository } from 'src/products/repositories/product-variantPricing.repository';
export declare class CollectionsService {
    private readonly collectionRepository;
    private readonly collectionRedirectRepository;
    private readonly productRepository;
    private readonly productVariantRepository;
    private readonly productVariantPricingRepository;
    private readonly productImageRepository;
    private readonly logger;
    constructor(collectionRepository: CollectionRepository, collectionRedirectRepository: CollectionRedirectRepository, productRepository: ProductRepository, productVariantRepository: ProductVariantRepository, productVariantPricingRepository: ProductVariantPricingRepository, productImageRepository: ProductImageRepository, logger: Logger);
    getMappedProductData(products: Product[]): Promise<{
        image: {
            id: string;
            image_url: string;
            is_primary: boolean;
        } | undefined;
        product_pricing: {
            id: string;
            selling_price: number;
            crossed_price: number;
        } | null | undefined;
        id: string;
        title: string;
        short_description: string;
        slug: string;
        status: StatusEnumType;
        product_variant: ProductVariant[];
        product_description: import("../products/entities/product-description.entity").ProductDescription[];
        category: import("../categories/entities/category.entity").Category;
        category_id: string;
        product_image: ProductImage[];
        created_at: Date;
        updated_at: Date;
        deleted_at: Date;
    }[]>;
    getCollectionsBySlug(slug: string): Promise<{
        data: {
            image: {
                id: string;
                image_url: string;
                is_primary: boolean;
            } | undefined;
            product_pricing: {
                id: string;
                selling_price: number;
                crossed_price: number;
            } | null | undefined;
            id: string;
            title: string;
            short_description: string;
            slug: string;
            status: StatusEnumType;
            product_variant: ProductVariant[];
            product_description: import("../products/entities/product-description.entity").ProductDescription[];
            category: import("../categories/entities/category.entity").Category;
            category_id: string;
            product_image: ProductImage[];
            created_at: Date;
            updated_at: Date;
            deleted_at: Date;
        }[];
    }>;
    createCollection(collectionDto: CreateCollectionDto): Promise<Collection | null>;
    getCollectionById(id: string): Promise<Collection>;
    getAllCollections(): Promise<{
        data: Collection[];
        total: number;
    }>;
    updateCollection(id: string, collectionDto: UpdateCollectionDto): Promise<Collection | null>;
    deleteCollection(id: string): Promise<{
        id: string;
        message: string;
    }>;
    validateCollectionData(collectionId: string): Promise<void>;
    createCollectionRedirect(collectionRedirectDto: CreateCollectionRedirectDto): Promise<CollectionRedirect>;
    getCollectionRedirectById(id: string): Promise<CollectionRedirect>;
    updateCollectionRedirect(id: string, collectionRedirectDto: CreateCollectionRedirectDto): Promise<CollectionRedirect | null>;
    deleteCollectionRedirect(id: string): Promise<{
        id: string;
        message: string;
    }>;
}
