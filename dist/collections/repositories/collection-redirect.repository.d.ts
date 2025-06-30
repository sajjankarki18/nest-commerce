import { DataSource, Repository } from 'typeorm';
import { CollectionRedirect } from '../entities/collection-redirect.entity';
export declare class CollectionRedirectRepository extends Repository<CollectionRedirect> {
    constructor(dataSource: DataSource);
}
