import { IsEnum, IsOptional, IsString } from "class-validator";
import { StatusEnumType } from "src/enums/StatusType.enum";

export class CreateCollectionDto {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  slug: string;

  @IsOptional()
  @IsString()
  image_url: string;

  @IsOptional()
  @IsEnum(StatusEnumType, {
    message: "The status should be either of {published/draft}",
  })
  status: StatusEnumType;
}
