import { Injectable } from "@nestjs/common";
import { ProductVariant } from "../entities/product-variant.entity";
import { DataSource, Repository } from "typeorm";

@Injectable()
export class ProductVariantRepository extends Repository<ProductVariant> {
  constructor(dataSource: DataSource) {
    super(ProductVariant, dataSource.createEntityManager());
  }
}
