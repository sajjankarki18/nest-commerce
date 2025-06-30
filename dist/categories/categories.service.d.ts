import { Logger } from '@nestjs/common';
import { Category } from './entities/category.entity';
import { CategoryRepository } from './repositories/category.repository';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { StatusEnumType } from 'src/enums/StatusType.enum';
import { Product } from 'src/products/entities/product.entity';
import { ProductRepository } from 'src/products/repositories/product.repository';
import { ProductVariant } from 'src/products/entities/product-variant.entity';
import { ProductVariantRepository } from 'src/products/repositories/product-variant.repository';
import { ProductImage } from 'src/products/entities/product-image.entity';
import { ProductImageRepository } from 'src/products/repositories/product-image.repository';
import { ProductVariantPricingRepository } from 'src/products/repositories/product-variantPricing.repository';
export declare class CategoriesService {
    private readonly categoryRepository;
    private readonly productRepository;
    private readonly productVariantRepository;
    private readonly productVariantPricingRepository;
    private readonly productImageRepository;
    private readonly logger;
    constructor(categoryRepository: CategoryRepository, productRepository: ProductRepository, productVariantRepository: ProductVariantRepository, productVariantPricingRepository: ProductVariantPricingRepository, productImageRepository: ProductImageRepository, logger: Logger);
    getAllParentCategories(): Promise<{
        data: Category[];
        total: number;
    }>;
    fetchCategory(id: string): Promise<Category[]>;
    getAllCategoriesForStore(): Promise<{
        data: {
            second_level: {
                third_level: Category[];
                id: string;
                parent_id: string;
                description: string;
                name: string;
                slug: string;
                status: StatusEnumType;
                product: Product[];
                created_at: Date;
                updated_at: Date;
                deleted_at: Date;
            }[];
            id: string;
            parent_id: string;
            description: string;
            name: string;
            slug: string;
            status: StatusEnumType;
            product: Product[];
            created_at: Date;
            updated_at: Date;
            deleted_at: Date;
        }[];
    }>;
    getAllCategoryProductsBySlug(slug: string): Promise<{
        data: {
            product_pricing: {
                id: string;
                selling_price: number;
                crossed_price: number;
            } | null | undefined;
            image: {
                id: string;
                image_url: string;
                is_primary: boolean;
            } | undefined;
            id: string;
            title: string;
            short_description: string;
            slug: string;
            status: StatusEnumType;
            product_variant: ProductVariant[];
            product_description: import("../products/entities/product-description.entity").ProductDescription[];
            category: Category;
            category_id: string;
            product_image: ProductImage[];
            created_at: Date;
            updated_at: Date;
            deleted_at: Date;
        }[];
    }>;
    categoryHeirarchyUpdation(categoryDto: CreateCategoryDto): Promise<void>;
    createCategory(categoryDto: CreateCategoryDto): Promise<Category | null>;
    getAllCategories({ page, limit, status, }: {
        page: number;
        limit: number;
        status?: StatusEnumType;
    }): Promise<{
        data: Category[];
        page: number;
        limit: number;
        total: number;
    }>;
    getCategoryById(id: string): Promise<Category>;
    updateCategory(id: string, categoryDto: UpdateCategoryDto): Promise<Category | null>;
    deleteCategory(id: string): Promise<{
        id: string;
        message: string;
    }>;
}
