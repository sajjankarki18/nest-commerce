import { IsEnum, IsOptional, IsString } from "class-validator";
import { StatusEnumType } from "src/enums/StatusType.enum";

export class CreateCategoryDto {
  @IsOptional()
  @IsString()
  parent_id: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsEnum(StatusEnumType, {
    message: "The status should be either of {published/draft}",
  })
  status: StatusEnumType;

  @IsOptional()
  @IsString({ message: "enter a valid slug!" })
  slug: string;
}
