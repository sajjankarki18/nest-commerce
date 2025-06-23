import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from "@nestjs/common";
import { DevicetypeService } from "./device-types.service";
import { CreateDeviceTypeDto } from "./dto/deviceType-dto/create-deviceType.dto";
import { UpdateDeviceTypeDto } from "./dto/deviceType-dto/update-deviceType.dto";
import { CreateBrandDto } from "./dto/brand-dto/create-brand.dto";
import { UpdateBrandDto } from "./dto/brand-dto/update-brand.dto";
import { CreateModelDto } from "./dto/model-dto/create-model.dto";
import { UpdateModelDto } from "./dto/model-dto/update-model.dto";

@Controller("/admin/devices")
export class DevicetypeAdminController {
  constructor(private readonly devicetypeService: DevicetypeService) {}

  /* device-types controller routes */
  /* create a new deivce-type */
  @Post()
  createDeviceType(@Body() deviceTypeDto: CreateDeviceTypeDto) {
    return this.devicetypeService.createDeviceType(deviceTypeDto);
  }

  /* get a device-type by id */
  @Get("/:id")
  getDeviceTypeById(@Param("id") id: string) {
    return this.devicetypeService.getDeviceTypeById(id);
  }

  /* get all device-types */
  @Get()
  getAllDeviceTypes(
    @Query("page") page: number,
    @Query("limit") limit: number,
  ) {
    return this.devicetypeService.getAllDeviceTypes({ page, limit });
  }

  /* update device-type */
  @Put("/:id")
  updateDeviceType(
    @Body() deviceTypeDto: UpdateDeviceTypeDto,
    @Param("id") id: string,
  ) {
    return this.devicetypeService.updateDeviceType(deviceTypeDto, id);
  }

  /* delete a device-type */
  @Delete("/:id")
  deleteDeviceType(@Param("id") id: string) {
    return this.devicetypeService.deleteDeviceType(id);
  }

  /* brand controllers */
  /* create a new brand */
  @Post("/brand/:deviceId")
  createBrand(
    @Body() brandDto: CreateBrandDto,
    @Param("deviceId") deviceId: string,
  ) {
    return this.devicetypeService.createBrand(brandDto, deviceId);
  }

  /* get brand by id */
  @Get("/brand/:id")
  getBrandById(@Param("id") id: string) {
    return this.devicetypeService.getBrandById(id);
  }

  /* get all brands */
  @Get("/brands")
  getAllBrands(@Query("page") page: number, @Query("limit") limit: number) {
    return this.devicetypeService.getAllBrands({ page, limit });
  }

  /* update brand */
  @Put("/brand/:id")
  updateBrand(@Body() brandDto: UpdateBrandDto, @Param("id") id: string) {
    return this.devicetypeService.updateBrand(brandDto, id);
  }

  /* delete a brand */
  @Delete("/brand/:id")
  deleteBrand(@Param("id") id: string) {
    return this.devicetypeService.deleteBrand(id);
  }

  /* model controllers */
  @Post("/model/:brandId")
  createModel(
    @Body() modelDto: CreateModelDto,
    @Param("brandId") brandId: string,
  ) {
    return this.devicetypeService.createModel(modelDto, brandId);
  }

  /* get brand by id */
  @Get("/model/:id")
  getModelById(@Param("id") id: string) {
    return this.devicetypeService.getModelById(id);
  }

  /* get all brands */
  @Get("/models")
  getAllModels(@Query("page") page: number, @Query("limit") limit: number) {
    return this.devicetypeService.getAllModels({ page, limit });
  }

  /* update brand */
  @Put("/model/:id")
  updateModel(@Body() modelDto: UpdateModelDto, @Param("id") id: string) {
    return this.devicetypeService.updateModel(modelDto, id);
  }

  /* delete a brand */
  @Delete("/model/:id")
  deleteModel(@Param("id") id: string) {
    return this.devicetypeService.deleteModel(id);
  }
}
