import { Category } from 'src/categories/entities/category.entity';
import { StatusEnumType } from 'src/enums/StatusType.enum';
import { ProductVariant } from './product-variant.entity';
import { ProductDescription } from './product-description.entity';
import { ProductImage } from './product-image.entity';
export declare class Product {
    id: string;
    title: string;
    short_description: string;
    slug: string;
    status: StatusEnumType;
    product_variant: ProductVariant[];
    product_description: ProductDescription[];
    category: Category;
    category_id: string;
    product_image: ProductImage[];
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
}
