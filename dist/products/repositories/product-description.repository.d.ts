import { DataSource, Repository } from 'typeorm';
import { ProductDescription } from '../entities/product-description.entity';
export declare class ProductDescriptionRepository extends Repository<ProductDescription> {
    constructor(dataSource: DataSource);
}
