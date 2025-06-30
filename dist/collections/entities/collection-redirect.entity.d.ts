import { CollectionRedirectTypeEnum } from '../types/collection-redirectType.enum';
export declare class CollectionRedirect {
    id: string;
    collection_id: string;
    redirect_type: CollectionRedirectTypeEnum;
    redirect_id: string;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
}
