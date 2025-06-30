import { Collection } from '../entities/collection.entity';
import { DataSource, Repository } from 'typeorm';
export declare class CollectionRepository extends Repository<Collection> {
    constructor(dataSource: DataSource);
}
