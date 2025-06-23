import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { Brand } from "../entities/brand.entity";

@Injectable()
export class BrandRepository extends Repository<Brand> {
    constructor(dataSource: DataSource) {
        super(Brand, dataSource.createEntityManager())
    }
}