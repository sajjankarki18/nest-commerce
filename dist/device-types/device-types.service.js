"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DevicetypeService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const device_type_entity_1 = require("./entities/device-type.entity");
const brand_repository_1 = require("./repositories/brand.repository");
const model_entity_1 = require("./entities/model.entity");
const model_repository_1 = require("./repositories/model.repository");
const slugify_1 = require("slugify");
const brand_entity_1 = require("./entities/brand.entity");
const device_type_repository_1 = require("./repositories/device-type.repository");
const StatusType_enum_1 = require("../enums/StatusType.enum");
let DevicetypeService = class DevicetypeService {
    deviceTypeRepository;
    brandRepository;
    modelRepository;
    logger;
    constructor(deviceTypeRepository, brandRepository, modelRepository, logger) {
        this.deviceTypeRepository = deviceTypeRepository;
        this.brandRepository = brandRepository;
        this.modelRepository = modelRepository;
        this.logger = logger;
    }
    async getAllBrandsWithDevices({ page, limit, deviceId, }) {
        if (!page || !limit) {
            const brands = await this.brandRepository.find({
                where: { status: StatusType_enum_1.StatusEnumType.Published, device_id: deviceId },
            });
            return {
                data: brands,
            };
        }
        if (isNaN(Number(page)) || isNaN(Number(limit)) || page < 0 || limit < 0) {
            throw new common_1.InternalServerErrorException({
                statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: ['page and limit should be of positive integers!'],
                error: 'Not Found',
            });
        }
        const newLimit = limit > 10 ? 10 : limit;
        const [brands, totalBrand] = await this.brandRepository.find({
            where: {
                status: StatusType_enum_1.StatusEnumType.Published,
                device_id: deviceId,
            },
            skip: (page - 1) * newLimit,
            take: newLimit,
            order: { created_at: 'desc' },
        });
        return {
            data: brands,
            page: page,
            limit: limit,
            total: totalBrand,
        };
    }
    async getAllModelsWithBrandId({ page, limit, brandId, }) {
        if (!page || !limit) {
            const brands = await this.modelRepository.find({
                where: { status: StatusType_enum_1.StatusEnumType.Published, brand_id: brandId },
            });
            return {
                data: brands,
            };
        }
        if (isNaN(Number(page)) || isNaN(Number(limit)) || page < 0 || limit < 0) {
            throw new common_1.InternalServerErrorException({
                statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: ['page and limit should be of positive integers!'],
                error: 'Not Found',
            });
        }
        const newLimit = limit > 10 ? 10 : limit;
        const [models, totalModels] = await this.modelRepository.find({
            where: {
                status: StatusType_enum_1.StatusEnumType.Published,
                brand_id: brandId,
            },
            skip: (page - 1) * newLimit,
            take: newLimit,
            order: { created_at: 'desc' },
        });
        return {
            data: models,
            page: page,
            limit: limit,
            total: totalModels,
        };
    }
    async createDeviceType(deviceTypeDto) {
        try {
            const deviceType = this.deviceTypeRepository.create({
                title: deviceTypeDto.title,
                image_url: deviceTypeDto.image_url,
                description: deviceTypeDto.description,
                status: deviceTypeDto.status,
            });
            return await this.deviceTypeRepository.save(deviceType);
        }
        catch (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException({
                statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: [
                    'some error occurred while creating a new deviceType, please try again later!',
                ],
                error: 'Not Found',
            });
        }
    }
    async getDeviceTypeById(id) {
        const deviceType = await this.deviceTypeRepository.findOne({
            where: {
                id: id,
            },
        });
        if (!deviceType) {
            throw new common_1.NotFoundException({
                statusCode: common_1.HttpStatus.NOT_FOUND,
                message: [`Device-type with ${id} has not found!`],
                error: 'Not Found',
            });
        }
        return deviceType;
    }
    async getAllDeviceTypes({ page, limit, }) {
        if (isNaN(Number(page)) || isNaN(Number(limit)) || page < 0 || limit < 0) {
            this.logger.warn('page and limit should be of positive integers!');
            throw new common_1.ConflictException({
                statusCode: common_1.HttpStatus.CONFLICT,
                message: ['Page and limit should be of positive integers!'],
                error: 'Conflict',
            });
        }
        const newLimit = limit > 10 ? 10 : limit;
        const [deviceTypes, totalDeviceTypes] = await this.deviceTypeRepository.findAndCount({
            skip: (page - 1) * newLimit,
            take: newLimit,
            order: { created_at: 'desc' },
        });
        this.logger.log('devices has been fetched successfully!');
        return {
            data: deviceTypes,
            page: page,
            limit: newLimit,
            total: totalDeviceTypes,
        };
    }
    async updateDeviceType(deviceTypeDto, id) {
        const deviceType = await this.getDeviceTypeById(id);
        try {
            let deviceTitleSlug = deviceType?.title;
            if (deviceTypeDto?.title && deviceTitleSlug !== deviceTypeDto.title) {
                deviceTitleSlug = (0, slugify_1.default)(deviceTypeDto.title, {
                    lower: true,
                    strict: true,
                });
            }
            await this.deviceTypeRepository.update({ id: id }, {
                title: deviceTypeDto.title,
                image_url: deviceTypeDto.image_url,
                description: deviceTypeDto.description,
                slug: deviceTitleSlug,
                status: deviceTypeDto.status,
            });
            return await this.deviceTypeRepository.findOne({ where: { id } });
        }
        catch (error) {
            console.log(error);
            this.logger.error('some error occurred, while updating the device-type');
            throw new common_1.InternalServerErrorException({
                statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: [
                    'some error occurred while updating the device-type, please try again',
                ],
                error: 'Internal Server Error',
            });
        }
    }
    async deleteDeviceType(id) {
        await this.getDeviceTypeById(id);
        try {
            await this.deviceTypeRepository.delete(id);
            return {
                id: `${id}`,
                message: 'device-type has been deleted successfully',
            };
        }
        catch (error) {
            this.logger.error('some error occurred, while deleting the device-type', error);
            throw new common_1.InternalServerErrorException({
                statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: [
                    'some error occurred while deleting the device-type, please try again',
                ],
                error: 'Internal Server Error',
            });
        }
    }
    async checkDeviceExists(deviceId) {
        const deviceType = await this.deviceTypeRepository.findOne({
            where: {
                id: deviceId,
            },
        });
        if (!deviceType) {
            throw new common_1.NotFoundException({
                statusCode: common_1.HttpStatus.NOT_FOUND,
                message: [`device_type with ${deviceId} not found`],
                error: 'Not Found',
            });
        }
    }
    async createBrand(brandDto, deviceId) {
        await this.checkDeviceExists(deviceId);
        try {
            const brand = this.brandRepository.create({
                title: brandDto.title,
                device_id: deviceId,
                status: brandDto.status,
            });
            return await this.brandRepository.save(brand);
        }
        catch (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException({
                statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: [
                    'some error occurred while creating a new brand, please try again!',
                ],
                error: 'Internal Server Error',
            });
        }
    }
    async getBrandById(id) {
        const brand = await this.brandRepository.findOne({
            where: {
                id: id,
            },
        });
        if (!brand) {
            throw new common_1.NotFoundException({
                statusCode: common_1.HttpStatus.NOT_FOUND,
                message: [`brand with ${id} not found!`],
                error: 'Not Found',
            });
        }
        return brand;
    }
    async getAllBrands({ page, limit, }) {
        if (isNaN(Number(page)) || isNaN(Number(limit)) || page < 0 || limit < 0) {
            throw new common_1.ConflictException({
                statusCode: common_1.HttpStatus.CONFLICT,
                message: ['page and limit should be positive integers!'],
                error: 'Conflict',
            });
        }
        const newLimit = limit > 10 ? 10 : limit;
        const [brands, totalBrands] = await this.brandRepository.findAndCount({
            skip: (page - 1) * newLimit,
            take: newLimit,
            order: { created_at: 'desc' },
        });
        return {
            data: brands,
            page: page,
            limit: limit,
            total: totalBrands,
        };
    }
    async updateBrand(brandDto, id) {
        await this.getBrandById(id);
        await this.checkDeviceExists(brandDto.device_id);
        try {
            await this.brandRepository.update({ id: id }, {
                title: brandDto.title,
                device_id: brandDto.device_id,
                status: brandDto.status,
            });
            return await this.brandRepository.findOne({ where: { id } });
        }
        catch (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException({
                statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: [
                    'some error occurred while updating a brand, please try again!',
                ],
                error: 'Internal Server Error',
            });
        }
    }
    async deleteBrand(id) {
        await this.getBrandById(id);
        try {
            await this.brandRepository.delete(id);
            return {
                id: `${id}`,
                message: 'brand has been deleted successfully!',
            };
        }
        catch (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException({
                statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: [
                    'some error occurred while deleting a brand, please try again!',
                ],
                error: 'Internal Server Error',
            });
        }
    }
    async checkBrandExists(brandId) {
        const brand = await this.brandRepository.findOne({
            where: {
                id: brandId,
            },
        });
        if (!brand) {
            throw new common_1.NotFoundException({
                statusCode: common_1.HttpStatus.NOT_FOUND,
                message: [`brand with ${brandId} not found`],
                error: 'Not Found',
            });
        }
    }
    async createModel(modelDto, brandId) {
        await this.checkBrandExists(brandId);
        try {
            const model = this.modelRepository.create({
                title: modelDto.title,
                brand_id: brandId,
                status: modelDto.status,
            });
            return await this.modelRepository.save(model);
        }
        catch (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException({
                statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: [
                    'some error occurred while creating a new model, please try again!',
                ],
                error: 'Internal Server Error',
            });
        }
    }
    async getModelById(id) {
        const model = await this.modelRepository.findOne({
            where: {
                id: id,
            },
        });
        if (!model) {
            throw new common_1.NotFoundException({
                statusCode: common_1.HttpStatus.NOT_FOUND,
                message: [`model with ${id} not found!`],
                error: 'Not Found',
            });
        }
        return model;
    }
    async getAllModels({ page, limit, }) {
        if (isNaN(Number(page)) || isNaN(Number(limit)) || page < 0 || limit < 0) {
            throw new common_1.ConflictException({
                statusCode: common_1.HttpStatus.CONFLICT,
                message: ['page and limit should be positive integers!'],
                error: 'Conflict',
            });
        }
        const newLimit = limit > 10 ? 10 : limit;
        const [models, totalModels] = await this.modelRepository.findAndCount({
            skip: (page - 1) * newLimit,
            take: newLimit,
            order: { created_at: 'desc' },
        });
        return {
            data: models,
            page: page,
            limit: limit,
            total: totalModels,
        };
    }
    async updateModel(modelDto, id) {
        await this.getModelById(id);
        await this.checkBrandExists(modelDto.brand_id);
        try {
            await this.modelRepository.update({ id: id }, {
                title: modelDto.title,
                brand_id: modelDto.brand_id,
                status: modelDto.status,
            });
            return await this.modelRepository.findOne({ where: { id } });
        }
        catch (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException({
                statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: [
                    'some error occurred while updating a model, please try again!',
                ],
                error: 'Internal Server Error',
            });
        }
    }
    async deleteModel(id) {
        await this.getModelById(id);
        try {
            await this.modelRepository.delete(id);
            return {
                id: `${id}`,
                message: 'model has been deleted successfully!',
            };
        }
        catch (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException({
                statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: [
                    'some error occurred while deleting a model, please try again!',
                ],
                error: 'Internal Server Error',
            });
        }
    }
};
exports.DevicetypeService = DevicetypeService;
exports.DevicetypeService = DevicetypeService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(device_type_entity_1.DeviceType)),
    __param(1, (0, typeorm_1.InjectRepository)(brand_entity_1.Brand)),
    __param(2, (0, typeorm_1.InjectRepository)(model_entity_1.Model)),
    __metadata("design:paramtypes", [device_type_repository_1.DevicetypeRespository,
        brand_repository_1.BrandRepository,
        model_repository_1.ModelRepository,
        common_1.Logger])
], DevicetypeService);
//# sourceMappingURL=device-types.service.js.map