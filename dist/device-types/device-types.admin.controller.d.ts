import { DevicetypeService } from './device-types.service';
import { CreateDeviceTypeDto } from './dto/deviceType-dto/create-deviceType.dto';
import { UpdateDeviceTypeDto } from './dto/deviceType-dto/update-deviceType.dto';
import { CreateBrandDto } from './dto/brand-dto/create-brand.dto';
import { UpdateBrandDto } from './dto/brand-dto/update-brand.dto';
import { CreateModelDto } from './dto/model-dto/create-model.dto';
import { UpdateModelDto } from './dto/model-dto/update-model.dto';
export declare class DevicetypeAdminController {
    private readonly devicetypeService;
    constructor(devicetypeService: DevicetypeService);
    createDeviceType(deviceTypeDto: CreateDeviceTypeDto): Promise<import("./entities/device-type.entity").DeviceType>;
    getDeviceTypeById(id: string): Promise<import("./entities/device-type.entity").DeviceType>;
    getAllDeviceTypes(page: number, limit: number): Promise<{
        data: import("./entities/device-type.entity").DeviceType[];
        page: number;
        limit: number;
        total: number;
    }>;
    updateDeviceType(deviceTypeDto: UpdateDeviceTypeDto, id: string): Promise<import("./entities/device-type.entity").DeviceType | null>;
    deleteDeviceType(id: string): Promise<{
        id: string;
        message: string;
    }>;
    createBrand(brandDto: CreateBrandDto, deviceId: string): Promise<import("./entities/brand.entity").Brand>;
    getBrandById(id: string): Promise<import("./entities/brand.entity").Brand>;
    getAllBrands(page: number, limit: number): Promise<{
        data: import("./entities/brand.entity").Brand[];
        page: number;
        limit: number;
        total: number;
    }>;
    updateBrand(brandDto: UpdateBrandDto, id: string): Promise<import("./entities/brand.entity").Brand | null>;
    deleteBrand(id: string): Promise<{
        id: string;
        message: string;
    }>;
    createModel(modelDto: CreateModelDto, brandId: string): Promise<import("./entities/model.entity").Model>;
    getModelById(id: string): Promise<import("./entities/model.entity").Model>;
    getAllModels(page: number, limit: number): Promise<{
        data: import("./entities/model.entity").Model[];
        page: number;
        limit: number;
        total: number;
    }>;
    updateModel(modelDto: UpdateModelDto, id: string): Promise<import("./entities/model.entity").Model | null>;
    deleteModel(id: string): Promise<{
        id: string;
        message: string;
    }>;
}
