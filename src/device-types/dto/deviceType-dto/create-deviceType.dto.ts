import { IsEnum, IsOptional, IsString } from "class-validator";
import { StatusEnumType } from "src/enums/StatusType.enum";

export class CreateDeviceTypeDto {
    @IsOptional()
    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    image_url: string;

    @IsOptional()
    @IsString()
    description: string;

    @IsOptional()
    @IsEnum(StatusEnumType, {message: 'The status should be either of published or draft!'})
    status: StatusEnumType;
}