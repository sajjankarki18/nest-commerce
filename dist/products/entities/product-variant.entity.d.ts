import { Product } from './product.entity';
import { ProductVariantPricing } from './product-variantPricing.entity';
import { ColorEnum, SizeEnum } from 'src/enums/VariantDetails.enum';
export declare class ProductVariant {
    id: string;
    variant_title: string;
    quantity: number;
    in_stock: boolean;
    size: SizeEnum;
    color: ColorEnum;
    product_sku: string;
    product: Product;
    product_id: string;
    product_variant_pricing: ProductVariantPricing[];
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
}
