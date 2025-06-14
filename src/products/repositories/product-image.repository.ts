import { DataSource, Repository } from 'typeorm';
import { ProductImage } from '../entities/product-image.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductImageRepository extends Repository<ProductImage> {
  constructor(datasource: DataSource) {
    super(ProductImage, datasource.createEntityManager());
  }
}
