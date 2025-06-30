import { Logger } from '@nestjs/common';
import { Product } from './entities/product.entity';
import { ProductRepository } from './repositories/product.repository';
import { ProductDescription } from './entities/product-description.entity';
import { ProductVariant } from './entities/product-variant.entity';
import { ProductVariantRepository } from './repositories/product-variant.repository';
import { ProductDescriptionRepository } from './repositories/product-description.repository';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { StatusEnumType } from 'src/enums/StatusType.enum';
import { CreateProductVariantDto } from './dto/create-productVariant.dto';
import { UpdateProductVariantDto } from './dto/update-productVariant.dto';
import { CreateProductDescriptionDto } from './dto/create-productDescription.dto';
import { UpdateProductDescriptionDto } from './dto/update-productDescription.dto';
import { ProductVariantPricingRepository } from './repositories/product-variantPricing.repository';
import { ProductImage } from './entities/product-image.entity';
import { ProductImageRepository } from './repositories/product-image.repository';
export declare class ProductService {
    private readonly logger;
    private readonly productRepository;
    private readonly productDescriptionRepository;
    private readonly productVariantRepository;
    private readonly productVariantPricingRepository;
    private readonly productImageRepository;
    constructor(logger: Logger, productRepository: ProductRepository, productDescriptionRepository: ProductDescriptionRepository, productVariantRepository: ProductVariantRepository, productVariantPricingRepository: ProductVariantPricingRepository, productImageRepository: ProductImageRepository);
    getAllProductsStoreFront({ page, limit, }: {
        page: number;
        limit: number;
    }): Promise<{
        data: Product[];
        page: number;
        limit: number;
        total: number;
    }>;
    getProductsBySlug(slug: string): Promise<{
        variants: ProductVariant[];
        images: ProductImage[];
        id: string;
        title: string;
        short_description: string;
        slug: string;
        status: StatusEnumType;
        product_variant: ProductVariant[];
        product_description: ProductDescription[];
        category: import("../categories/entities/category.entity").Category;
        category_id: string;
        product_image: ProductImage[];
        created_at: Date;
        updated_at: Date;
        deleted_at: Date;
    }>;
    createProduct(productDto: CreateProductDto): Promise<Product | null>;
    getProductById(id: string): Promise<Product>;
    getAllProducts({ page, limit, status, }: {
        page: number;
        limit: number;
        status?: StatusEnumType;
    }): Promise<{
        data: Product[];
        page: number;
        limit: number;
        total: number;
    }>;
    updateProduct(id: string, productDto: UpdateProductDto): Promise<Product | null>;
    deleteProduct(id: string): Promise<{
        id: string;
        message: string;
    }>;
    validateProduct(productVariantDto: CreateProductVariantDto): Promise<void>;
    createProductVariant(productVariantDto: CreateProductVariantDto): Promise<ProductVariant>;
    getProductVariantById(id: string): Promise<ProductVariant>;
    updateProductVariant(id: string, productVariantDto: UpdateProductVariantDto): Promise<ProductVariant | null>;
    deleteProductVariant(id: string): Promise<{
        id: string;
        message: string;
    }>;
    createProductDescription(productDescriptionDto: CreateProductDescriptionDto): Promise<ProductDescription & Product>;
    getProductDescriptionById(id: string): Promise<ProductDescription>;
    updateProductDescription(id: string, productDescriptionDto: UpdateProductDescriptionDto): Promise<Product | null>;
    deleteProductDescription(id: string): Promise<{
        id: string;
        message: string;
    }>;
}
