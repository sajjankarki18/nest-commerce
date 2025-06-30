"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.V1Module = void 0;
const common_1 = require("@nestjs/common");
const banners_module_1 = require("./banners/banners.module");
const products_module_1 = require("./products/products.module");
const categories_module_1 = require("./categories/categories.module");
const collections_module_1 = require("./collections/collections.module");
const auth_users_module_1 = require("./auth_users/auth_users.module");
let V1Module = class V1Module {
};
exports.V1Module = V1Module;
exports.V1Module = V1Module = __decorate([
    (0, common_1.Module)({
        imports: [
            banners_module_1.BannersModule,
            products_module_1.ProductsModule,
            categories_module_1.CategoriesModule,
            collections_module_1.CollectionsModule,
            auth_users_module_1.AuthUsersModule,
        ],
    })
], V1Module);
//# sourceMappingURL=v1.module.js.map