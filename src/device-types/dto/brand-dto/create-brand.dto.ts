import { IsEnum, IsOptional, IsString } from "class-validator";
import { StatusEnumType } from "src/enums/StatusType.enum";

export class CreateBrandDto {
    @IsOptional()
    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    device_id: string;

    @IsOptional()
    @IsEnum(StatusEnumType)
    status: StatusEnumType;
}