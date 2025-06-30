"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectionsModule = void 0;
const common_1 = require("@nestjs/common");
const collections_admin_controller_1 = require("./collections.admin.controller");
const collections_service_1 = require("./collections.service");
const typeorm_1 = require("@nestjs/typeorm");
const collection_redirect_entity_1 = require("./entities/collection-redirect.entity");
const collection_entity_1 = require("./entities/collection.entity");
const collections_controller_1 = require("./collections.controller");
const product_entity_1 = require("../products/entities/product.entity");
const product_image_entity_1 = require("../products/entities/product-image.entity");
const product_variant_entity_1 = require("../products/entities/product-variant.entity");
const product_variantPricing_entity_1 = require("../products/entities/product-variantPricing.entity");
let CollectionsModule = class CollectionsModule {
};
exports.CollectionsModule = CollectionsModule;
exports.CollectionsModule = CollectionsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                collection_entity_1.Collection,
                collection_redirect_entity_1.CollectionRedirect,
                product_entity_1.Product,
                product_image_entity_1.ProductImage,
                product_variant_entity_1.ProductVariant,
                product_variantPricing_entity_1.ProductVariantPricing,
            ]),
        ],
        controllers: [collections_admin_controller_1.CollectionsAdminController, collections_controller_1.CollectionController],
        providers: [collections_service_1.CollectionsService, common_1.Logger],
    })
], CollectionsModule);
//# sourceMappingURL=collections.module.js.map