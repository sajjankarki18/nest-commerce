import { RedirectTypeEnum } from 'src/enums/RedirectType.enum';
import { StatusEnumType } from 'src/enums/StatusType.enum';
export declare class Banner {
    id: string;
    title: string;
    image_url: string;
    status: StatusEnumType;
    is_active: boolean;
    redirect_type: RedirectTypeEnum;
    redirect_id: string;
    created_At: Date;
    updated_at: Date;
    deleted_at: Date;
}
