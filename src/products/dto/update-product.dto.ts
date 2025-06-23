import { CreateProductDto } from "./create-product.dto";

export class UpdateProductDto extends CreateProductDto {
  private readonly id: string;
}
