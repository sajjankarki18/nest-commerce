import { DeviceType } from './device-type.entity';
import { StatusEnumType } from 'src/enums/StatusType.enum';
import { Model } from './model.entity';
export declare class Brand {
    id: string;
    title: string;
    device_id: string;
    device_type: DeviceType;
    model: Model[];
    status: StatusEnumType;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
}
