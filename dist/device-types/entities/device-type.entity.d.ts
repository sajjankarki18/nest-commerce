import { StatusEnumType } from 'src/enums/StatusType.enum';
import { Brand } from './brand.entity';
export declare class DeviceType {
    id: string;
    title: string;
    image_url: string;
    slug: string;
    description: string;
    status: StatusEnumType;
    brand: Brand[];
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
}
