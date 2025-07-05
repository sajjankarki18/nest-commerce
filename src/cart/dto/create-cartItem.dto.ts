import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateCartItemDto {
  @IsNotEmpty({ message: 'product_id should not be empty!' })
  @IsString()
  product_id: string;

  @IsNotEmpty({ message: 'variant_id should not be empty!' })
  @IsString()
  variant_id: string;

  @IsNotEmpty({ message: 'quantity should not be empty' })
  @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
  @IsNumber()
  quantity: number;

  @IsOptional()
  cart_id: string;
}
