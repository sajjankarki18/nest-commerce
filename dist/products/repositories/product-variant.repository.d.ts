import { DataSource, Repository } from 'typeorm';
import { ProductVariant } from '../entities/product-variant.entity';
export declare class ProductVariantRepository extends Repository<ProductVariant> {
    constructor(dataSource: DataSource);
}
