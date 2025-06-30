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
exports.DeviceTypeController = void 0;
const common_1 = require("@nestjs/common");
const device_types_service_1 = require("./device-types.service");
let DeviceTypeController = class DeviceTypeController {
    deviceTypeService;
    constructor(deviceTypeService) {
        this.deviceTypeService = deviceTypeService;
    }
    getAllBrandsWithDevices(page, limit, deviceId) {
        return this.deviceTypeService.getAllBrandsWithDevices({
            page,
            limit,
            deviceId,
        });
    }
    getAllModelsWithBrandId(page, limit, brandId) {
        return this.deviceTypeService.getAllModelsWithBrandId({
            page,
            limit,
            brandId,
        });
    }
};
exports.DeviceTypeController = DeviceTypeController;
__decorate([
    (0, common_1.Get)('/brands/:deviceId'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Param)('deviceId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String]),
    __metadata("design:returntype", void 0)
], DeviceTypeController.prototype, "getAllBrandsWithDevices", null);
__decorate([
    (0, common_1.Get)('/models/:brandId'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Param)('brandId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String]),
    __metadata("design:returntype", void 0)
], DeviceTypeController.prototype, "getAllModelsWithBrandId", null);
exports.DeviceTypeController = DeviceTypeController = __decorate([
    (0, common_1.Controller)('/devices'),
    __metadata("design:paramtypes", [device_types_service_1.DevicetypeService])
], DeviceTypeController);
//# sourceMappingURL=device-types.controller.js.map