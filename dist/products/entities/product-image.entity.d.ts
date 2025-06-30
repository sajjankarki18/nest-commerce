import { Product } from './product.entity';
export declare class ProductImage {
    id: string;
    image_url: string;
    is_primary: boolean;
    product: Product;
    product_id: string;
}
