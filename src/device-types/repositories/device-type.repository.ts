import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { DeviceType } from '../entities/device-type.entity';

@Injectable()
export class DevicetypeRespository extends Repository<DeviceType> {
  constructor(dataSource: DataSource) {
    super(DeviceType, dataSource.createEntityManager());
  }
}
