"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeviceTypesModule = void 0;
const common_1 = require("@nestjs/common");
const device_types_controller_1 = require("./device-types.controller");
const device_types_admin_controller_1 = require("./device-types.admin.controller");
const device_types_service_1 = require("./device-types.service");
const typeorm_1 = require("@nestjs/typeorm");
const device_type_entity_1 = require("./entities/device-type.entity");
const brand_entity_1 = require("./entities/brand.entity");
const model_entity_1 = require("./entities/model.entity");
let DeviceTypesModule = class DeviceTypesModule {
};
exports.DeviceTypesModule = DeviceTypesModule;
exports.DeviceTypesModule = DeviceTypesModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([device_type_entity_1.DeviceType, brand_entity_1.Brand, model_entity_1.Model])],
        controllers: [device_types_controller_1.DeviceTypeController, device_types_admin_controller_1.DevicetypeAdminController],
        providers: [device_types_service_1.DevicetypeService, common_1.Logger],
    })
], DeviceTypesModule);
//# sourceMappingURL=device-types.module.js.map