import { IsBoolean, IsEnum, IsOptional, IsString } from "class-validator";
import { RedirectTypeEnum } from "src/enums/RedirectType.enum";
import { StatusEnumType } from "src/enums/StatusType.enum";

export class CreateBannerDto {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  image_url: string;

  @IsOptional()
  @IsEnum(StatusEnumType, {
    message: "The status should be either of {published/draft}",
  })
  status: StatusEnumType;

  @IsOptional()
  @IsBoolean({ message: "is_active should be a boolean value" })
  is_active: boolean;

  @IsOptional()
  @IsEnum(RedirectTypeEnum, {
    message: "The redirects should be either of {category/product/collection}",
  })
  redirect_type: RedirectTypeEnum;

  @IsOptional()
  @IsString()
  redirect_id: string;
}
