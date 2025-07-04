import { CreateProductVariantDto } from './create-productVariant.dto';

export class UpdateProductVariantDto extends CreateProductVariantDto {
  private readonly id: string;
}
