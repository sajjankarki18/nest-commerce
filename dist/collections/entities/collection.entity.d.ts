import { StatusEnumType } from 'src/enums/StatusType.enum';
export declare class Collection {
    id: string;
    title: string;
    slug: string;
    image_url: string;
    status: StatusEnumType;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
}
