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
exports.CollectionsAdminController = void 0;
const common_1 = require("@nestjs/common");
const collections_service_1 = require("./collections.service");
const swagger_1 = require("@nestjs/swagger");
const collection_entity_1 = require("./entities/collection.entity");
const create_collection_dto_1 = require("./dto/create-collection.dto");
const update_collection_dto_1 = require("./dto/update-collection.dto");
const create_collectionRedirect_dto_1 = require("./dto/create-collectionRedirect.dto");
const update_collectionRedirectDto_1 = require("./dto/update-collectionRedirectDto");
let CollectionsAdminController = class CollectionsAdminController {
    collectionsService;
    constructor(collectionsService) {
        this.collectionsService = collectionsService;
    }
    createCollection(collectionDto) {
        return this.collectionsService.createCollection(collectionDto);
    }
    getCollectionById(id) {
        return this.collectionsService.getCollectionById(id);
    }
    getAllCollections() {
        return this.collectionsService.getAllCollections();
    }
    updateCollection(id, collectionDto) {
        return this.collectionsService.updateCollection(id, collectionDto);
    }
    deleteCollection(id) {
        return this.collectionsService.deleteCollection(id);
    }
    createCollectionRedirect(collectionRedirectDto) {
        return this.collectionsService.createCollectionRedirect(collectionRedirectDto);
    }
    getCollectionRedirectById(id) {
        return this.collectionsService.getCollectionRedirectById(id);
    }
    updateCollectionRedirect(id, collectionRedirectDto) {
        return this.collectionsService.updateCollectionRedirect(id, collectionRedirectDto);
    }
    deleteCollectionRedirect(id) {
        return this.collectionsService.deleteCollectionRedirect(id);
    }
};
exports.CollectionsAdminController = CollectionsAdminController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiCreatedResponse)({
        description: 'collection  created successfully',
        type: collection_entity_1.Collection,
    }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Invalid input!' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_collection_dto_1.CreateCollectionDto]),
    __metadata("design:returntype", void 0)
], CollectionsAdminController.prototype, "createCollection", null);
__decorate([
    (0, common_1.Get)('/:id'),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'UUID of the banner' }),
    (0, swagger_1.ApiOkResponse)({
        description: 'collection  fetched successfully!',
        type: collection_entity_1.Collection,
    }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'collection  not found!' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CollectionsAdminController.prototype, "getCollectionById", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOkResponse)({
        description: 'All banners fetched successfully!',
        schema: {
            type: 'object',
            properties: {
                data: { type: 'array', items: { $ref: '#/components/schemas/Banner' } },
                total: { type: 'number' },
            },
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CollectionsAdminController.prototype, "getAllCollections", null);
__decorate([
    (0, common_1.Put)('/:id'),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'UUID of the banner' }),
    (0, swagger_1.ApiOkResponse)({
        description: 'collection  updated successfully!',
        type: collection_entity_1.Collection,
    }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Invalid input' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'collection  not found!' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_collection_dto_1.UpdateCollectionDto]),
    __metadata("design:returntype", void 0)
], CollectionsAdminController.prototype, "updateCollection", null);
__decorate([
    (0, common_1.Delete)('/:id'),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'UUID of the banner' }),
    (0, swagger_1.ApiOkResponse)({ description: 'collection  deleted successfully!' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'collection  not found!' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CollectionsAdminController.prototype, "deleteCollection", null);
__decorate([
    (0, common_1.Post)('/collection-redirect'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_collectionRedirect_dto_1.CreateCollectionRedirectDto]),
    __metadata("design:returntype", void 0)
], CollectionsAdminController.prototype, "createCollectionRedirect", null);
__decorate([
    (0, common_1.Get)('/collection-redirect/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CollectionsAdminController.prototype, "getCollectionRedirectById", null);
__decorate([
    (0, common_1.Put)('/collection-redirect/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_collectionRedirectDto_1.UpdateCollectionRedirectDto]),
    __metadata("design:returntype", void 0)
], CollectionsAdminController.prototype, "updateCollectionRedirect", null);
__decorate([
    (0, common_1.Delete)('/collection-redirect/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CollectionsAdminController.prototype, "deleteCollectionRedirect", null);
exports.CollectionsAdminController = CollectionsAdminController = __decorate([
    (0, swagger_1.ApiTags)('Collections Admin'),
    (0, common_1.Controller)('/admin/collections'),
    __metadata("design:paramtypes", [collections_service_1.CollectionsService])
], CollectionsAdminController);
//# sourceMappingURL=collections.admin.controller.js.map