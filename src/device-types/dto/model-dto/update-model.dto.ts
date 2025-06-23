import { CreateModelDto } from "./create-model.dto";

export class UpdateModelDto extends CreateModelDto {
  private readonly id: string;
}
