import { DataSource, Repository } from 'typeorm';
import { DeviceType } from '../entities/device-type.entity';
export declare class DevicetypeRespository extends Repository<DeviceType> {
    constructor(dataSource: DataSource);
}
