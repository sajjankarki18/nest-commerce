"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const category_entity_1 = require("./entities/category.entity");
const categories_admin_controller_1 = require("./categories.admin.controller");
const categories_service_1 = require("./categories.service");
const categories_controller_1 = require("./categories.controller");
const product_entity_1 = require("../products/entities/product.entity");
const product_variant_entity_1 = require("../products/entities/product-variant.entity");
const product_variantPricing_entity_1 = require("../products/entities/product-variantPricing.entity");
const product_image_entity_1 = require("../products/entities/product-image.entity");
let CategoriesModule = class CategoriesModule {
};
exports.CategoriesModule = CategoriesModule;
exports.CategoriesModule = CategoriesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                category_entity_1.Category,
                product_entity_1.Product,
                product_variant_entity_1.ProductVariant,
                product_variantPricing_entity_1.ProductVariantPricing,
                product_image_entity_1.ProductImage,
            ]),
        ],
        controllers: [categories_admin_controller_1.CategoriesAdminController, categories_controller_1.CategoriesController],
        providers: [categories_service_1.CategoriesService, common_1.Logger],
    })
], CategoriesModule);
//# sourceMappingURL=categories.module.js.map