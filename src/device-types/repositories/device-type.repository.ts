import { Injectable } from "@nestjs/common";
import { DeviceType } from "../entities/device-type.entity";
import { DataSource, Repository } from "typeorm";

@Injectable()
export class DeviceTypeRepository extends Repository<DeviceType> {
  constructor(dataSource: DataSource) {
    super(DeviceType, dataSource.createEntityManager());
  }
}
