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
exports.Model = void 0;
const typeorm_1 = require("typeorm");
const brand_entity_1 = require("./brand.entity");
const StatusType_enum_1 = require("../../enums/StatusType.enum");
let Model = class Model {
    id;
    title;
    brand_id;
    brand;
    status;
    created_at;
    updated_at;
    deleted_at;
};
exports.Model = Model;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Model.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Model.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Model.prototype, "brand_id", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => brand_entity_1.Brand, (brand) => brand.model),
    (0, typeorm_1.JoinColumn)({ name: 'brand_id' }),
    __metadata("design:type", brand_entity_1.Brand)
], Model.prototype, "brand", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, default: StatusType_enum_1.StatusEnumType.Draft }),
    __metadata("design:type", String)
], Model.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Model.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Model.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)(),
    __metadata("design:type", Date)
], Model.prototype, "deleted_at", void 0);
exports.Model = Model = __decorate([
    (0, typeorm_1.Entity)({ name: 'model' })
], Model);
//# sourceMappingURL=model.entity.js.map