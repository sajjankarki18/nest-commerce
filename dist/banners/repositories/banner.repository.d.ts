import { DataSource, Repository } from 'typeorm';
import { Banner } from '../entities/banner.entity';
export declare class BannerRepository extends Repository<Banner> {
    constructor(dataSource: DataSource);
}
