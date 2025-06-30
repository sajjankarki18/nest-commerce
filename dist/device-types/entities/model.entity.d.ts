import { Brand } from './brand.entity';
import { StatusEnumType } from 'src/enums/StatusType.enum';
export declare class Model {
    id: string;
    title: string;
    brand_id: string;
    brand: Brand;
    status: StatusEnumType;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
}
