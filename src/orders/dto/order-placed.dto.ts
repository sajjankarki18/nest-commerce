import { IsNotEmpty, IsString } from 'class-validator';

export class OrderPlacedDto {
  @IsNotEmpty({ message: 'cart_id should not be empty!' })
  @IsString()
  cart_id: string;
}
