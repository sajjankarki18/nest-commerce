import { StatusEnumType } from 'src/enums/StatusType.enum';
export declare class CreateProductDto {
    title: string;
    slug: string;
    status: StatusEnumType;
    category_id: string;
}
