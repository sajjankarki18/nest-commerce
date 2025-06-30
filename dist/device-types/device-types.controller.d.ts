import { DevicetypeService } from './device-types.service';
export declare class DeviceTypeController {
    private readonly deviceTypeService;
    constructor(deviceTypeService: DevicetypeService);
    getAllBrandsWithDevices(page: number, limit: number, deviceId: string): Promise<{
        data: import("./entities/brand.entity").Brand[];
        page?: undefined;
        limit?: undefined;
        total?: undefined;
    } | {
        data: import("./entities/brand.entity").Brand;
        page: number;
        limit: number;
        total: import("./entities/brand.entity").Brand;
    }>;
    getAllModelsWithBrandId(page: number, limit: number, brandId: string): Promise<{
        data: import("./entities/model.entity").Model[];
        page?: undefined;
        limit?: undefined;
        total?: undefined;
    } | {
        data: import("./entities/model.entity").Model;
        page: number;
        limit: number;
        total: import("./entities/model.entity").Model;
    }>;
}
