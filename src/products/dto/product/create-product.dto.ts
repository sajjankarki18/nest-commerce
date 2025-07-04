import { IsEnum, IsOptional, IsString } from 'class-validator';
import { StatusEnumType } from 'src/enums/StatusType.enum';

export class CreateProductDto {
  @IsOptional()
  @IsString({ message: 'enter a valid product title!' })
  title: string;

  @IsOptional()
  @IsString()
  slug: string;

  @IsOptional()
  @IsEnum(StatusEnumType)
  status: StatusEnumType;

  @IsOptional()
  @IsString({ message: 'enter a valid category_id' })
  category_id: string;
}
