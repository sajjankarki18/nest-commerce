import { CreateModelDto } from "./create-model.dto";

export class UpdateModelDto extends CreateModelDto {
    readonly id: string;
}