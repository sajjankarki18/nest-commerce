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
exports.Banner = void 0;
const RedirectType_enum_1 = require("../../enums/RedirectType.enum");
const StatusType_enum_1 = require("../../enums/StatusType.enum");
const typeorm_1 = require("typeorm");
let Banner = class Banner {
    id;
    title;
    image_url;
    status;
    is_active;
    redirect_type;
    redirect_id;
    created_At;
    updated_at;
    deleted_at;
};
exports.Banner = Banner;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Banner.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Banner.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Banner.prototype, "image_url", void 0);
__decorate([
    (0, typeorm_1.Column)({
        nullable: true,
        default: StatusType_enum_1.StatusEnumType.Draft,
    }),
    __metadata("design:type", String)
], Banner.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, default: false }),
    __metadata("design:type", Boolean)
], Banner.prototype, "is_active", void 0);
__decorate([
    (0, typeorm_1.Column)({
        nullable: true,
        default: RedirectType_enum_1.RedirectTypeEnum.None,
    }),
    __metadata("design:type", String)
], Banner.prototype, "redirect_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Banner.prototype, "redirect_id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Banner.prototype, "created_At", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Banner.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)(),
    __metadata("design:type", Date)
], Banner.prototype, "deleted_at", void 0);
exports.Banner = Banner = __decorate([
    (0, typeorm_1.Entity)({ name: 'banner' })
], Banner);
//# sourceMappingURL=banner.entity.js.map