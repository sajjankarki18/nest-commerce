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
exports.CollectionRedirect = void 0;
const typeorm_1 = require("typeorm");
const collection_redirectType_enum_1 = require("../types/collection-redirectType.enum");
let CollectionRedirect = class CollectionRedirect {
    id;
    collection_id;
    redirect_type;
    redirect_id;
    created_at;
    updated_at;
    deleted_at;
};
exports.CollectionRedirect = CollectionRedirect;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], CollectionRedirect.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], CollectionRedirect.prototype, "collection_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], CollectionRedirect.prototype, "redirect_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], CollectionRedirect.prototype, "redirect_id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], CollectionRedirect.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], CollectionRedirect.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)(),
    __metadata("design:type", Date)
], CollectionRedirect.prototype, "deleted_at", void 0);
exports.CollectionRedirect = CollectionRedirect = __decorate([
    (0, typeorm_1.Entity)({ name: 'collection_redirect' })
], CollectionRedirect);
//# sourceMappingURL=collection-redirect.entity.js.map