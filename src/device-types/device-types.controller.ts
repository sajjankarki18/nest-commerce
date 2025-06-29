import { Controller, Get, Param, Query } from '@nestjs/common';
import { DevicetypeService } from './device-types.service';

@Controller('/devices')
export class DeviceTypeController {
  constructor(private readonly deviceTypeService: DevicetypeService) {}

  @Get('/brands/:deviceId')
  getAllBrandsWithDevices(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Param('deviceId') deviceId: string,
  ) {
    return this.deviceTypeService.getAllBrandsWithDevices({
      page,
      limit,
      deviceId,
    });
  }

  @Get('/models/:brandId')
  getAllModelsWithBrandId(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Param('brandId') brandId: string,
  ) {
    return this.deviceTypeService.getAllModelsWithBrandId({
      page,
      limit,
      brandId,
    });
  }
}
