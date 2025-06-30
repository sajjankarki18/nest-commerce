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
exports.ProductVariant = void 0;
const typeorm_1 = require("typeorm");
const product_entity_1 = require("./product.entity");
const product_variantPricing_entity_1 = require("./product-variantPricing.entity");
const VariantDetails_enum_1 = require("../../enums/VariantDetails.enum");
let ProductVariant = class ProductVariant {
    id;
    variant_title;
    quantity;
    in_stock;
    size;
    color;
    product_sku;
    product;
    product_id;
    product_variant_pricing;
    created_at;
    updated_at;
    deleted_at;
};
exports.ProductVariant = ProductVariant;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ProductVariant.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ProductVariant.prototype, "variant_title", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], ProductVariant.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, default: false }),
    __metadata("design:type", Boolean)
], ProductVariant.prototype, "in_stock", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, default: VariantDetails_enum_1.SizeEnum.S }),
    __metadata("design:type", String)
], ProductVariant.prototype, "size", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, default: VariantDetails_enum_1.ColorEnum.Red }),
    __metadata("design:type", String)
], ProductVariant.prototype, "color", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ProductVariant.prototype, "product_sku", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_entity_1.Product, (product) => product.product_variant),
    (0, typeorm_1.JoinColumn)({ name: 'product_id' }),
    __metadata("design:type", product_entity_1.Product)
], ProductVariant.prototype, "product", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ProductVariant.prototype, "product_id", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => product_variantPricing_entity_1.ProductVariantPricing, (product_variant_pricing) => product_variant_pricing.product_variant),
    __metadata("design:type", Array)
], ProductVariant.prototype, "product_variant_pricing", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ProductVariant.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], ProductVariant.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)(),
    __metadata("design:type", Date)
], ProductVariant.prototype, "deleted_at", void 0);
exports.ProductVariant = ProductVariant = __decorate([
    (0, typeorm_1.Entity)({ name: 'product_variant' })
], ProductVariant);
//# sourceMappingURL=product-variant.entity.js.map