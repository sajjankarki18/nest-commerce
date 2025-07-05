import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCartDto {
  @IsNotEmpty({ message: 'customer_id should not be empty!' })
  @IsString()
  customer_id: string;

  @IsNotEmpty({ message: 'shipping_price should not be empty!' })
  @IsString()
  shipping_price: string;

  @IsOptional()
  total_price: number;
}
