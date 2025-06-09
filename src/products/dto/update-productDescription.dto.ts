import { CreateProductDescriptionDto } from './create-productDescription.dto';

export class UpdateProductDescriptionDto extends CreateProductDescriptionDto {
  private readonly id: string;
}
