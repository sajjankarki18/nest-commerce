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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Brand = void 0;
const typeorm_1 = require("typeorm");
const device_type_entity_1 = require("./device-type.entity");
const StatusType_enum_1 = require("../../enums/StatusType.enum");
const model_entity_1 = require("./model.entity");
let Brand = class Brand {
    id;
    title;
    device_id;
    device_type;
    model;
    status;
    created_at;
    updated_at;
    deleted_at;
};
exports.Brand = Brand;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Brand.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Brand.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Brand.prototype, "device_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => device_type_entity_1.DeviceType, (device_type) => device_type.brand),
    (0, typeorm_1.JoinColumn)({ name: 'device_id' }),
    __metadata("design:type", device_type_entity_1.DeviceType)
], Brand.prototype, "device_type", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => model_entity_1.Model, (model) => model.brand),
    __metadata("design:type", Array)
], Brand.prototype, "model", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, default: StatusType_enum_1.StatusEnumType.Draft }),
    __metadata("design:type", String)
], Brand.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Brand.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Brand.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)(),
    __metadata("design:type", Date)
], Brand.prototype, "deleted_at", void 0);
exports.Brand = Brand = __decorate([
    (0, typeorm_1.Entity)({ name: 'brand' })
], Brand);
//# sourceMappingURL=brand.entity.js.map