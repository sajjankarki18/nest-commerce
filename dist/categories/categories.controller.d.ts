import { CategoriesService } from './categories.service';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    getAllParentCategories(): Promise<{
        data: import("./entities/category.entity").Category[];
        total: number;
    }>;
    getAllCategoriesForStore(): Promise<{
        data: {
            second_level: {
                third_level: import("./entities/category.entity").Category[];
                id: string;
                parent_id: string;
                description: string;
                name: string;
                slug: string;
                status: import("../enums/StatusType.enum").StatusEnumType;
                product: import("../products/entities/product.entity").Product[];
                created_at: Date;
                updated_at: Date;
                deleted_at: Date;
            }[];
            id: string;
            parent_id: string;
            description: string;
            name: string;
            slug: string;
            status: import("../enums/StatusType.enum").StatusEnumType;
            product: import("../products/entities/product.entity").Product[];
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
            status: import("../enums/StatusType.enum").StatusEnumType;
            product_variant: import("../products/entities/product-variant.entity").ProductVariant[];
            product_description: import("../products/entities/product-description.entity").ProductDescription[];
            category: import("./entities/category.entity").Category;
            category_id: string;
            product_image: import("../products/entities/product-image.entity").ProductImage[];
            created_at: Date;
            updated_at: Date;
            deleted_at: Date;
        }[];
    }>;
}
