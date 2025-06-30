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
exports.CategoriesAdminController = void 0;
const common_1 = require("@nestjs/common");
const categories_service_1 = require("./categories.service");
const swagger_1 = require("@nestjs/swagger");
const create_category_dto_1 = require("./dto/create-category.dto");
const category_entity_1 = require("./entities/category.entity");
const update_category_dto_1 = require("./dto/update-category.dto");
const StatusType_enum_1 = require("../enums/StatusType.enum");
let CategoriesAdminController = class CategoriesAdminController {
    categoriesService;
    constructor(categoriesService) {
        this.categoriesService = categoriesService;
    }
    createCategory(categoryDto) {
        return this.categoriesService.createCategory(categoryDto);
    }
    getAllCategories(page = 1, limit = 10, status) {
        return this.categoriesService.getAllCategories({ page, limit, status });
    }
    getCategoryById(id) {
        return this.categoriesService.getCategoryById(id);
    }
    updateCategory(id, categoryDto) {
        return this.categoriesService.updateCategory(id, categoryDto);
    }
    deleteCategory(id) {
        return this.categoriesService.deleteCategory(id);
    }
};
exports.CategoriesAdminController = CategoriesAdminController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiCreatedResponse)({
        description: 'Category created successfully',
        type: category_entity_1.Category,
    }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Invalid input!' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_category_dto_1.CreateCategoryDto]),
    __metadata("design:returntype", void 0)
], CategoriesAdminController.prototype, "createCategory", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOkResponse)({
        description: 'All Categories fetched successfully!',
        schema: {
            type: 'object',
            properties: {
                data: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/category' },
                },
                total: { type: 'number' },
            },
        },
    }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String]),
    __metadata("design:returntype", void 0)
], CategoriesAdminController.prototype, "getAllCategories", null);
__decorate([
    (0, common_1.Get)('/:id'),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'UUID of the category' }),
    (0, swagger_1.ApiOkResponse)({
        description: 'category fetched successfully!',
        type: category_entity_1.Category,
    }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'category not found!' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CategoriesAdminController.prototype, "getCategoryById", null);
__decorate([
    (0, common_1.Put)('/:id'),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'UUID of the category' }),
    (0, swagger_1.ApiOkResponse)({
        description: 'category updated successfully!',
        type: category_entity_1.Category,
    }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Invalid input' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'category not found!' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_category_dto_1.UpdateCategoryDto]),
    __metadata("design:returntype", void 0)
], CategoriesAdminController.prototype, "updateCategory", null);
__decorate([
    (0, common_1.Delete)('/:id'),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'UUID of the category' }),
    (0, swagger_1.ApiOkResponse)({ description: 'category deleted successfully!' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'category not found!' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CategoriesAdminController.prototype, "deleteCategory", null);
exports.CategoriesAdminController = CategoriesAdminController = __decorate([
    (0, swagger_1.ApiTags)('Category Admin'),
    (0, common_1.Controller)('/admin/categories'),
    __metadata("design:paramtypes", [categories_service_1.CategoriesService])
], CategoriesAdminController);
//# sourceMappingURL=categories.admin.controller.js.map