import { IsEnum, IsOptional, IsString } from "class-validator";
import { StatusEnumType } from "src/enums/StatusType.enum";

export class CreateModelDto {
    @IsOptional()
    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    brand_id: string;

    @IsOptional()
    @IsEnum(StatusEnumType)
    status: StatusEnumType;
}