import { StatusEnumType } from 'src/enums/StatusType.enum';
export declare class CreateCategoryDto {
    parent_id: string;
    description: string;
    name: string;
    status: StatusEnumType;
    slug: string;
}
