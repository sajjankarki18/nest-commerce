import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { Model } from "../entities/model.entity";

@Injectable()
export class ModelRepository extends Repository<Model> {
    constructor(dataSource: DataSource) {
        super(Model, dataSource.createEntityManager())
    }
}