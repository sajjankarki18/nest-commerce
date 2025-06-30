"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const product_entity_1 = require("./entities/product.entity");
const product_variant_entity_1 = require("./entities/product-variant.entity");
const product_variantPricing_entity_1 = require("./entities/product-variantPricing.entity");
const product_description_entity_1 = require("./entities/product-description.entity");
const products_admin_controller_1 = require("./products.admin.controller");
const products_service_1 = require("./products.service");
const product_image_entity_1 = require("./entities/product-image.entity");
const products_controller_1 = require("./products.controller");
let ProductsModule = class ProductsModule {
};
exports.ProductsModule = ProductsModule;
exports.ProductsModule = ProductsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                product_entity_1.Product,
                product_variant_entity_1.ProductVariant,
                product_variantPricing_entity_1.ProductVariantPricing,
                product_description_entity_1.ProductDescription,
                product_image_entity_1.ProductImage,
            ]),
        ],
        controllers: [products_admin_controller_1.ProductAdminController, products_controller_1.ProductController],
        providers: [products_service_1.ProductService, common_1.Logger],
    })
], ProductsModule);
//# sourceMappingURL=products.module.js.map