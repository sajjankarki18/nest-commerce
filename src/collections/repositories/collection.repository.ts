import { Injectable } from '@nestjs/common';
import { Collection } from '../entities/collection.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class CollectionRepository extends Repository<Collection> {
  constructor(dataSource: DataSource) {
    super(Collection, dataSource.createEntityManager());
  }
}
