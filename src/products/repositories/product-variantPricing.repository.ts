import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ProductVariantPricing } from '../entities/product-variantPricing.entity';

@Injectable()
export class ProductVariantPricingRepository extends Repository<ProductVariantPricing> {
  constructor(dataSource: DataSource) {
    super(ProductVariantPricing, dataSource.createEntityManager());
  }
}
