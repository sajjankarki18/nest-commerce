import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { ProductDescription } from "../entities/product-description.entity";

@Injectable()
export class ProductDescriptionRepository extends Repository<ProductDescription> {
  constructor(dataSource: DataSource) {
    super(ProductDescription, dataSource.createEntityManager());
  }
}
