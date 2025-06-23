import { CreateBrandDto } from "./create-brand.dto";

export class UpdateBrandDto extends CreateBrandDto {
    readonly id: string;
}