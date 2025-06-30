import { ProductService } from './products.service';
export declare class ProductController {
    private readonly productService;
    constructor(productService: ProductService);
    getAllProductsStoreFront(page: number, limit: number): Promise<{
        data: import("./entities/product.entity").Product[];
        page: number;
        limit: number;
        total: number;
    }>;
    getProductsBySlug(slug: string): Promise<{
        variants: import("./entities/product-variant.entity").ProductVariant[];
        images: import("./entities/product-image.entity").ProductImage[];
        id: string;
        title: string;
        short_description: string;
        slug: string;
        status: import("../enums/StatusType.enum").StatusEnumType;
        product_variant: import("./entities/product-variant.entity").ProductVariant[];
        product_description: import("./entities/product-description.entity").ProductDescription[];
        category: import("../categories/entities/category.entity").Category;
        category_id: string;
        product_image: import("./entities/product-image.entity").ProductImage[];
        created_at: Date;
        updated_at: Date;
        deleted_at: Date;
    }>;
}
