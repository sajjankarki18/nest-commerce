import { IsString, IsOptional } from "class-validator";

export class CreateProductDescriptionDto {
  @IsOptional()
  @IsString({ message: "enter a valid description!" })
  description?: string;

  @IsOptional()
  @IsString({ message: "enter a valid product_id" })
  product_id: string;
}
