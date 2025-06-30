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
exports.ProductVariantPricing = void 0;
const CurrencyType_enum_1 = require("../../enums/CurrencyType.enum");
const typeorm_1 = require("typeorm");
const product_variant_entity_1 = require("./product-variant.entity");
let ProductVariantPricing = class ProductVariantPricing {
    id;
    currency_type;
    variant_id;
    product_variant;
    price;
    selling_price;
    crossed_price;
};
exports.ProductVariantPricing = ProductVariantPricing;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ProductVariantPricing.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, default: CurrencyType_enum_1.CurrencyTypeEnum.NPR }),
    __metadata("design:type", String)
], ProductVariantPricing.prototype, "currency_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ProductVariantPricing.prototype, "variant_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_variant_entity_1.ProductVariant, (product_variant) => product_variant.product_variant_pricing),
    (0, typeorm_1.JoinColumn)({ name: 'variant_id' }),
    __metadata("design:type", product_variant_entity_1.ProductVariant)
], ProductVariantPricing.prototype, "product_variant", void 0);
__decorate([
    (0, typeorm_1.Column)('numeric', { nullable: true, precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], ProductVariantPricing.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)('numeric', { nullable: true, precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], ProductVariantPricing.prototype, "selling_price", void 0);
__decorate([
    (0, typeorm_1.Column)('numeric', { nullable: true, precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], ProductVariantPricing.prototype, "crossed_price", void 0);
exports.ProductVariantPricing = ProductVariantPricing = __decorate([
    (0, typeorm_1.Entity)({ name: 'product_variant_pricing' })
], ProductVariantPricing);
//# sourceMappingURL=product-variantPricing.entity.js.map