import { CreateDeviceTypeDto } from './create-deviceType.dto';

export class UpdateDeviceTypeDto extends CreateDeviceTypeDto {
  readonly id: string;
}
