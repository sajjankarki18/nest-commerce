import { RedirectTypeEnum } from 'src/enums/RedirectType.enum';
import { StatusEnumType } from 'src/enums/StatusType.enum';
export declare class CreateBannerDto {
    title: string;
    image_url: string;
    status: StatusEnumType;
    is_active: boolean;
    redirect_type: RedirectTypeEnum;
    redirect_id: string;
}
