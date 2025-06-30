import { DataSource, Repository } from 'typeorm';
import { ProductImage } from '../entities/product-image.entity';
export declare class ProductImageRepository extends Repository<ProductImage> {
    constructor(datasource: DataSource);
}
