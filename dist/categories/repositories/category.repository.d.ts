import { DataSource, Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
export declare class CategoryRepository extends Repository<Category> {
    constructor(dataSource: DataSource);
}
