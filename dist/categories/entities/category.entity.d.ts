import { StatusEnumType } from 'src/enums/StatusType.enum';
import { Product } from 'src/products/entities/product.entity';
export declare class Category {
    id: string;
    parent_id: string;
    description: string;
    name: string;
    slug: string;
    status: StatusEnumType;
    product: Product[];
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
}
