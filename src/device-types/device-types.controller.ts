import { Controller } from "@nestjs/common";
import { DevicetypeService } from "./device-types.service";

@Controller("/devices")
export class DeviceTypeController {
  constructor(private readonly deviceTypeService: DevicetypeService) {}
}
