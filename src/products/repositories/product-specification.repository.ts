import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { productSpecification } from '../entities/product-specification.entity';

@Injectable()
export class ProductSpecificationRepository extends Repository<productSpecification> {
  constructor(dataSource: DataSource) {
    super(productSpecification, dataSource.createEntityManager());
  }
}
