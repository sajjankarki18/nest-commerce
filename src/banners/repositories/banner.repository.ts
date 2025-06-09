import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Banner } from '../entities/banner.entity';

@Injectable()
export class BannerRepository extends Repository<Banner> {
  constructor(dataSource: DataSource) {
    super(Banner, dataSource.createEntityManager());
  }
}
