import { DataSource, Repository } from 'typeorm';
import { ProductVariantPricing } from '../entities/product-variantPricing.entity';
export declare class ProductVariantPricingRepository extends Repository<ProductVariantPricing> {
    constructor(dataSource: DataSource);
}
