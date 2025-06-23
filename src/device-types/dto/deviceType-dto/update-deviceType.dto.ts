import { CreateDeviceTypeDto } from "./create-deviceType.dto";

export class UpdateDeviceTypeDto extends CreateDeviceTypeDto {
  private readonly id: string;
}
