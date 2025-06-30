import { Logger } from '@nestjs/common';
import { DeviceType } from './entities/device-type.entity';
import { BrandRepository } from './repositories/brand.repository';
import { Model } from './entities/model.entity';
import { ModelRepository } from './repositories/model.repository';
import { Brand } from './entities/brand.entity';
import { CreateDeviceTypeDto } from './dto/deviceType-dto/create-deviceType.dto';
import { UpdateDeviceTypeDto } from './dto/deviceType-dto/update-deviceType.dto';
import { CreateBrandDto } from './dto/brand-dto/create-brand.dto';
import { UpdateBrandDto } from './dto/brand-dto/update-brand.dto';
import { CreateModelDto } from './dto/model-dto/create-model.dto';
import { UpdateModelDto } from './dto/model-dto/update-model.dto';
import { DevicetypeRespository } from './repositories/device-type.repository';
export declare class DevicetypeService {
    private readonly deviceTypeRepository;
    private readonly brandRepository;
    private readonly modelRepository;
    private readonly logger;
    constructor(deviceTypeRepository: DevicetypeRespository, brandRepository: BrandRepository, modelRepository: ModelRepository, logger: Logger);
    getAllBrandsWithDevices({ page, limit, deviceId, }: {
        page: number;
        limit: number;
        deviceId: string;
    }): Promise<{
        data: Brand[];
        page?: undefined;
        limit?: undefined;
        total?: undefined;
    } | {
        data: Brand;
        page: number;
        limit: number;
        total: Brand;
    }>;
    getAllModelsWithBrandId({ page, limit, brandId, }: {
        page: number;
        limit: number;
        brandId: string;
    }): Promise<{
        data: Model[];
        page?: undefined;
        limit?: undefined;
        total?: undefined;
    } | {
        data: Model;
        page: number;
        limit: number;
        total: Model;
    }>;
    createDeviceType(deviceTypeDto: CreateDeviceTypeDto): Promise<DeviceType>;
    getDeviceTypeById(id: string): Promise<DeviceType>;
    getAllDeviceTypes({ page, limit, }: {
        page: number;
        limit: number;
    }): Promise<{
        data: DeviceType[];
        page: number;
        limit: number;
        total: number;
    }>;
    updateDeviceType(deviceTypeDto: UpdateDeviceTypeDto, id: string): Promise<DeviceType | null>;
    deleteDeviceType(id: string): Promise<{
        id: string;
        message: string;
    }>;
    checkDeviceExists(deviceId: string): Promise<void>;
    createBrand(brandDto: CreateBrandDto, deviceId: string): Promise<Brand>;
    getBrandById(id: string): Promise<Brand>;
    getAllBrands({ page, limit, }: {
        page: number;
        limit: number;
    }): Promise<{
        data: Brand[];
        page: number;
        limit: number;
        total: number;
    }>;
    updateBrand(brandDto: UpdateBrandDto, id: string): Promise<Brand | null>;
    deleteBrand(id: string): Promise<{
        id: string;
        message: string;
    }>;
    checkBrandExists(brandId: string): Promise<void>;
    createModel(modelDto: CreateModelDto, brandId: string): Promise<Model>;
    getModelById(id: string): Promise<Model>;
    getAllModels({ page, limit, }: {
        page: number;
        limit: number;
    }): Promise<{
        data: Model[];
        page: number;
        limit: number;
        total: number;
    }>;
    updateModel(modelDto: UpdateModelDto, id: string): Promise<Model | null>;
    deleteModel(id: string): Promise<{
        id: string;
        message: string;
    }>;
}
