import { CreateBrandDto } from "./create-brand.dto";

export class UpdateBrandDto extends CreateBrandDto {
  private readonly id: string;
}
