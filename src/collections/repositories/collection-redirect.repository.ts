import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { CollectionRedirect } from "../entities/collection-redirect.entity";

@Injectable()
export class CollectionRedirectRepository extends Repository<CollectionRedirect> {
  constructor(dataSource: DataSource) {
    super(CollectionRedirect, dataSource.createEntityManager());
  }
}
