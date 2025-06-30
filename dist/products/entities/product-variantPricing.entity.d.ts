import { CurrencyTypeEnum } from 'src/enums/CurrencyType.enum';
import { ProductVariant } from './product-variant.entity';
export declare class ProductVariantPricing {
    id: string;
    currency_type: CurrencyTypeEnum;
    variant_id: string;
    product_variant: ProductVariant;
    price: number;
    selling_price: number;
    crossed_price: number;
}
