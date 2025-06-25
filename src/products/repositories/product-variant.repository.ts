import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ProductVariant } from '../entities/product-variant.entity';

@Injectable()
export class ProductVariantRepository extends Repository<ProductVariant> {
  constructor(dataSource: DataSource) {
    super(ProductVariant, dataSource.createEntityManager());
  }
}
