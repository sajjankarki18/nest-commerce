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
exports.BannerAdminController = void 0;
const common_1 = require("@nestjs/common");
const banners_service_1 = require("./banners.service");
const create_banner_dto_1 = require("./dto/create-banner.dto");
const update_banner_dto_1 = require("./dto/update-banner.dto");
const swagger_1 = require("@nestjs/swagger");
const banner_entity_1 = require("./entities/banner.entity");
let BannerAdminController = class BannerAdminController {
    bannerService;
    constructor(bannerService) {
        this.bannerService = bannerService;
    }
    createBanner(bannerDto) {
        return this.bannerService.createBanner(bannerDto);
    }
    getBannerById(id) {
        return this.bannerService.getBannerById(id);
    }
    getAllBanners() {
        return this.bannerService.getAllBanners();
    }
    updateBanner(id, bannerDto) {
        return this.bannerService.updateBanner(id, bannerDto);
    }
    deleteBanner(id) {
        return this.bannerService.deleteBanner(id);
    }
};
exports.BannerAdminController = BannerAdminController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiCreatedResponse)({
        description: 'Banner created successfully',
        type: banner_entity_1.Banner,
    }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Invalid input!' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_banner_dto_1.CreateBannerDto]),
    __metadata("design:returntype", void 0)
], BannerAdminController.prototype, "createBanner", null);
__decorate([
    (0, common_1.Get)('/:id'),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'UUID of the banner' }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Banner fetched successfully!',
        type: banner_entity_1.Banner,
    }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Banner not found!' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BannerAdminController.prototype, "getBannerById", null);
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
], BannerAdminController.prototype, "getAllBanners", null);
__decorate([
    (0, common_1.Put)('/:id'),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'UUID of the banner' }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Banner updated successfully!',
        type: banner_entity_1.Banner,
    }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Invalid input' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Banner not found!' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_banner_dto_1.UpdateBannerDto]),
    __metadata("design:returntype", void 0)
], BannerAdminController.prototype, "updateBanner", null);
__decorate([
    (0, common_1.Delete)('/:id'),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'UUID of the banner' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Banner deleted successfully!' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Banner not found!' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BannerAdminController.prototype, "deleteBanner", null);
exports.BannerAdminController = BannerAdminController = __decorate([
    (0, swagger_1.ApiTags)('Admin banners'),
    (0, common_1.Controller)('/admin/banners'),
    __metadata("design:paramtypes", [banners_service_1.BannerService])
], BannerAdminController);
//# sourceMappingURL=banners.admin.controller.js.map