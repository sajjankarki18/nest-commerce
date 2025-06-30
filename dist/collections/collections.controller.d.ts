import { CollectionsService } from './collections.service';
export declare class CollectionController {
    private readonly collectionService;
    constructor(collectionService: CollectionsService);
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
            status: import("../enums/StatusType.enum").StatusEnumType;
            product_variant: import("../products/entities/product-variant.entity").ProductVariant[];
            product_description: import("../products/entities/product-description.entity").ProductDescription[];
            category: import("../categories/entities/category.entity").Category;
            category_id: string;
            product_image: import("../products/entities/product-image.entity").ProductImage[];
            created_at: Date;
            updated_at: Date;
            deleted_at: Date;
        }[];
    }>;
}
