import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProductVariantDto {
  @IsOptional()
  @IsString({ message: 'enter a valid variant_title!' })
  variant_title: string;

  @IsOptional()
  @IsString()
  variant_description: string;

  @IsOptional()
  @IsNumber()
  quantity: number;

  @IsOptional()
  @IsBoolean()
  in_stock: boolean;

  @IsOptional()
  @IsString({ message: 'enter a valid product_id' })
  product_id: string;
}
