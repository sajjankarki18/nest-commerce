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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductAdminController = void 0;
const common_1 = require("@nestjs/common");
const products_service_1 = require("./products.service");
const swagger_1 = require("@nestjs/swagger");
const create_product_dto_1 = require("./dto/create-product.dto");
const update_product_dto_1 = require("./dto/update-product.dto");
const StatusType_enum_1 = require("../enums/StatusType.enum");
const create_productVariant_dto_1 = require("./dto/create-productVariant.dto");
const update_productVariant_dto_1 = require("./dto/update-productVariant.dto");
const create_productDescription_dto_1 = require("./dto/create-productDescription.dto");
const update_productDescription_dto_1 = require("./dto/update-productDescription.dto");
let ProductAdminController = class ProductAdminController {
    productService;
    constructor(productService) {
        this.productService = productService;
    }
    createProduct(productDto) {
        return this.productService.createProduct(productDto);
    }
    getProductById(id) {
        return this.productService.getProductById(id);
    }
    getAllProducts(page, limit, status) {
        return this.productService.getAllProducts({ page, limit, status });
    }
    updateProduct(id, productDto) {
        return this.productService.updateProduct(id, productDto);
    }
    deleteProduct(id) {
        return this.productService.deleteProduct(id);
    }
    createProductVariant(productVariantDto) {
        return this.productService.createProductVariant(productVariantDto);
    }
    getProductVariantById(id) {
        return this.productService.getProductVariantById(id);
    }
    updateProductVariant(id, productVariantDto) {
        return this.productService.updateProductVariant(id, productVariantDto);
    }
    deleteProductVariant(id) {
        return this.productService.deleteProductVariant(id);
    }
    createProductDescription(productDescriptionDto) {
        return this.productService.createProductDescription(productDescriptionDto);
    }
    getProductDescriptionById(id) {
        return this.productService.getProductDescriptionById(id);
    }
    updateProductDescription(id, productDescriptionDto) {
        return this.productService.updateProductDescription(id, productDescriptionDto);
    }
    deleteProductDescription(id) {
        return this.productService.deleteProductDescription(id);
    }
};
exports.ProductAdminController = ProductAdminController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_product_dto_1.CreateProductDto]),
    __metadata("design:returntype", void 0)
], ProductAdminController.prototype, "createProduct", null);
__decorate([
    (0, common_1.Get)('/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductAdminController.prototype, "getProductById", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String]),
    __metadata("design:returntype", void 0)
], ProductAdminController.prototype, "getAllProducts", null);
__decorate([
    (0, common_1.Put)('/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_product_dto_1.UpdateProductDto]),
    __metadata("design:returntype", void 0)
], ProductAdminController.prototype, "updateProduct", null);
__decorate([
    (0, common_1.Delete)('/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductAdminController.prototype, "deleteProduct", null);
__decorate([
    (0, common_1.Post)('/product-variant'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_productVariant_dto_1.CreateProductVariantDto]),
    __metadata("design:returntype", void 0)
], ProductAdminController.prototype, "createProductVariant", null);
__decorate([
    (0, common_1.Get)('/product-variant/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductAdminController.prototype, "getProductVariantById", null);
__decorate([
    (0, common_1.Put)('/product-variant/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_productVariant_dto_1.UpdateProductVariantDto]),
    __metadata("design:returntype", void 0)
], ProductAdminController.prototype, "updateProductVariant", null);
__decorate([
    (0, common_1.Delete)('/product-variant/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductAdminController.prototype, "deleteProductVariant", null);
__decorate([
    (0, common_1.Post)('/product-description'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_productDescription_dto_1.CreateProductDescriptionDto]),
    __metadata("design:returntype", void 0)
], ProductAdminController.prototype, "createProductDescription", null);
__decorate([
    (0, common_1.Get)('/product-description/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductAdminController.prototype, "getProductDescriptionById", null);
__decorate([
    (0, common_1.Put)('/product-description/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_productDescription_dto_1.UpdateProductDescriptionDto]),
    __metadata("design:returntype", void 0)
], ProductAdminController.prototype, "updateProductDescription", null);
__decorate([
    (0, common_1.Delete)('/product-description/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductAdminController.prototype, "deleteProductDescription", null);
exports.ProductAdminController = ProductAdminController = __decorate([
    (0, swagger_1.ApiTags)('Admin Products'),
    (0, common_1.Controller)('/admin/products'),
    __metadata("design:paramtypes", [products_service_1.ProductService])
], ProductAdminController);
//# sourceMappingURL=products.admin.controller.js.map