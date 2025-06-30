"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BannersModule = void 0;
const common_1 = require("@nestjs/common");
const banners_admin_controller_1 = require("./banners.admin.controller");
const banners_service_1 = require("./banners.service");
const typeorm_1 = require("@nestjs/typeorm");
const banner_entity_1 = require("./entities/banner.entity");
const category_entity_1 = require("../categories/entities/category.entity");
const categories_module_1 = require("../categories/categories.module");
const collections_module_1 = require("../collections/collections.module");
const collection_entity_1 = require("../collections/entities/collection.entity");
const product_entity_1 = require("../products/entities/product.entity");
const products_module_1 = require("../products/products.module");
const banners_controller_1 = require("./banners.controller");
let BannersModule = class BannersModule {
};
exports.BannersModule = BannersModule;
exports.BannersModule = BannersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([banner_entity_1.Banner, category_entity_1.Category, product_entity_1.Product, collection_entity_1.Collection]),
            (0, common_1.forwardRef)(() => categories_module_1.CategoriesModule),
            (0, common_1.forwardRef)(() => collections_module_1.CollectionsModule),
            (0, common_1.forwardRef)(() => products_module_1.ProductsModule),
        ],
        controllers: [banners_admin_controller_1.BannerAdminController, banners_controller_1.BannerController],
        providers: [banners_service_1.BannerService, common_1.Logger],
    })
], BannersModule);
//# sourceMappingURL=banners.module.js.map