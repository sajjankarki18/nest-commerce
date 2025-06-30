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
exports.DevicetypeAdminController = void 0;
const common_1 = require("@nestjs/common");
const device_types_service_1 = require("./device-types.service");
const create_deviceType_dto_1 = require("./dto/deviceType-dto/create-deviceType.dto");
const update_deviceType_dto_1 = require("./dto/deviceType-dto/update-deviceType.dto");
const create_brand_dto_1 = require("./dto/brand-dto/create-brand.dto");
const update_brand_dto_1 = require("./dto/brand-dto/update-brand.dto");
const create_model_dto_1 = require("./dto/model-dto/create-model.dto");
const update_model_dto_1 = require("./dto/model-dto/update-model.dto");
let DevicetypeAdminController = class DevicetypeAdminController {
    devicetypeService;
    constructor(devicetypeService) {
        this.devicetypeService = devicetypeService;
    }
    createDeviceType(deviceTypeDto) {
        return this.devicetypeService.createDeviceType(deviceTypeDto);
    }
    getDeviceTypeById(id) {
        return this.devicetypeService.getDeviceTypeById(id);
    }
    getAllDeviceTypes(page, limit) {
        return this.devicetypeService.getAllDeviceTypes({ page, limit });
    }
    updateDeviceType(deviceTypeDto, id) {
        return this.devicetypeService.updateDeviceType(deviceTypeDto, id);
    }
    deleteDeviceType(id) {
        return this.devicetypeService.deleteDeviceType(id);
    }
    createBrand(brandDto, deviceId) {
        return this.devicetypeService.createBrand(brandDto, deviceId);
    }
    getBrandById(id) {
        return this.devicetypeService.getBrandById(id);
    }
    getAllBrands(page, limit) {
        return this.devicetypeService.getAllBrands({ page, limit });
    }
    updateBrand(brandDto, id) {
        return this.devicetypeService.updateBrand(brandDto, id);
    }
    deleteBrand(id) {
        return this.devicetypeService.deleteBrand(id);
    }
    createModel(modelDto, brandId) {
        return this.devicetypeService.createModel(modelDto, brandId);
    }
    getModelById(id) {
        return this.devicetypeService.getModelById(id);
    }
    getAllModels(page, limit) {
        return this.devicetypeService.getAllModels({ page, limit });
    }
    updateModel(modelDto, id) {
        return this.devicetypeService.updateModel(modelDto, id);
    }
    deleteModel(id) {
        return this.devicetypeService.deleteModel(id);
    }
};
exports.DevicetypeAdminController = DevicetypeAdminController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_deviceType_dto_1.CreateDeviceTypeDto]),
    __metadata("design:returntype", void 0)
], DevicetypeAdminController.prototype, "createDeviceType", null);
__decorate([
    (0, common_1.Get)('/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DevicetypeAdminController.prototype, "getDeviceTypeById", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], DevicetypeAdminController.prototype, "getAllDeviceTypes", null);
__decorate([
    (0, common_1.Put)('/:id'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_deviceType_dto_1.UpdateDeviceTypeDto, String]),
    __metadata("design:returntype", void 0)
], DevicetypeAdminController.prototype, "updateDeviceType", null);
__decorate([
    (0, common_1.Delete)('/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DevicetypeAdminController.prototype, "deleteDeviceType", null);
__decorate([
    (0, common_1.Post)('/brand/:deviceId'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('deviceId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_brand_dto_1.CreateBrandDto, String]),
    __metadata("design:returntype", void 0)
], DevicetypeAdminController.prototype, "createBrand", null);
__decorate([
    (0, common_1.Get)('/brand/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DevicetypeAdminController.prototype, "getBrandById", null);
__decorate([
    (0, common_1.Get)('/brands'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], DevicetypeAdminController.prototype, "getAllBrands", null);
__decorate([
    (0, common_1.Put)('/brand/:id'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_brand_dto_1.UpdateBrandDto, String]),
    __metadata("design:returntype", void 0)
], DevicetypeAdminController.prototype, "updateBrand", null);
__decorate([
    (0, common_1.Delete)('/brand/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DevicetypeAdminController.prototype, "deleteBrand", null);
__decorate([
    (0, common_1.Post)('/model/:brandId'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('brandId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_model_dto_1.CreateModelDto, String]),
    __metadata("design:returntype", void 0)
], DevicetypeAdminController.prototype, "createModel", null);
__decorate([
    (0, common_1.Get)('/model/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DevicetypeAdminController.prototype, "getModelById", null);
__decorate([
    (0, common_1.Get)('/models'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], DevicetypeAdminController.prototype, "getAllModels", null);
__decorate([
    (0, common_1.Put)('/model/:id'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_model_dto_1.UpdateModelDto, String]),
    __metadata("design:returntype", void 0)
], DevicetypeAdminController.prototype, "updateModel", null);
__decorate([
    (0, common_1.Delete)('/model/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DevicetypeAdminController.prototype, "deleteModel", null);
exports.DevicetypeAdminController = DevicetypeAdminController = __decorate([
    (0, common_1.Controller)('/admin/devices'),
    __metadata("design:paramtypes", [device_types_service_1.DevicetypeService])
], DevicetypeAdminController);
//# sourceMappingURL=device-types.admin.controller.js.map