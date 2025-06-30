import { DataSource, Repository } from 'typeorm';
import { Brand } from '../entities/brand.entity';
export declare class BrandRepository extends Repository<Brand> {
    constructor(dataSource: DataSource);
}
