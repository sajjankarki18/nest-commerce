import { DataSource, Repository } from 'typeorm';
import { Model } from '../entities/model.entity';
export declare class ModelRepository extends Repository<Model> {
    constructor(dataSource: DataSource);
}
