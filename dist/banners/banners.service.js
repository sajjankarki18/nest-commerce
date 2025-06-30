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
exports.BannerService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const banner_entity_1 = require("./entities/banner.entity");
const banner_repository_1 = require("./repositories/banner.repository");
const RedirectType_enum_1 = require("../enums/RedirectType.enum");
const category_entity_1 = require("../categories/entities/category.entity");
const category_repository_1 = require("../categories/repositories/category.repository");
const collection_entity_1 = require("../collections/entities/collection.entity");
const collection_repository_1 = require("../collections/repositories/collection.repository");
const product_entity_1 = require("../products/entities/product.entity");
const product_repository_1 = require("../products/repositories/product.repository");
const StatusType_enum_1 = require("../enums/StatusType.enum");
let BannerService = class BannerService {
    bannerRepository;
    categoryRepository;
    collectionRepository;
    productRepository;
    logger;
    constructor(bannerRepository, categoryRepository, collectionRepository, productRepository, logger) {
        this.bannerRepository = bannerRepository;
        this.categoryRepository = categoryRepository;
        this.collectionRepository = collectionRepository;
        this.productRepository = productRepository;
        this.logger = logger;
    }
    async getAllBannersWithRedirects() {
        const banners = await this.bannerRepository.find({
            where: {
                status: StatusType_enum_1.StatusEnumType.Published,
                is_active: true,
            },
        });
        const bannerRedirectData = [];
        for (const banner of banners) {
            let redirects = { title: '', id: '' };
            if (RedirectType_enum_1.RedirectTypeEnum.Category === banner.redirect_type) {
                const category = await this.categoryRepository.findOne({
                    where: {
                        id: banner.redirect_id,
                    },
                });
                redirects = category
                    ? { title: category.name, id: category.id }
                    : { title: '', id: '' };
            }
            if (RedirectType_enum_1.RedirectTypeEnum.Product === banner.redirect_type) {
                const product = await this.productRepository.findOne({
                    where: {
                        id: banner.redirect_id,
                    },
                });
                redirects = product
                    ? { title: product.title, id: product.id }
                    : { title: '', id: '' };
            }
            if (RedirectType_enum_1.RedirectTypeEnum.Collection === banner.redirect_type) {
                const collection = await this.collectionRepository.findOne({
                    where: {
                        id: banner.redirect_id,
                    },
                });
                redirects = collection
                    ? { title: collection.title, id: collection.id }
                    : { title: '', id: '' };
            }
            bannerRedirectData.push({
                ...banner,
                redirects: redirects,
            });
        }
        return {
            data: bannerRedirectData,
        };
    }
    async validateBannerRedirectTypes(bannerDto) {
        if (bannerDto.redirect_type === RedirectType_enum_1.RedirectTypeEnum.Category) {
            const category = await this.categoryRepository.findOne({
                where: {
                    id: bannerDto.redirect_id,
                },
            });
            if (!category) {
                this.logger.warn('category redirect not found!');
                throw new common_1.NotFoundException({
                    statusCode: common_1.HttpStatus.NOT_FOUND,
                    message: ['redirect of category not found!'],
                    error: 'Not Found Error',
                });
            }
        }
        if (bannerDto.redirect_type === RedirectType_enum_1.RedirectTypeEnum.Product) {
            const product = await this.productRepository.findOne({
                where: {
                    id: bannerDto.redirect_id,
                },
            });
            if (!product) {
                this.logger.warn('product redirect not found');
                throw new common_1.NotFoundException({
                    statusCode: common_1.HttpStatus.NOT_FOUND,
                    message: ['redirect of product not found!'],
                    error: 'Not Found',
                });
            }
        }
        if (bannerDto.redirect_type === RedirectType_enum_1.RedirectTypeEnum.Collection) {
            const collection = await this.collectionRepository.findOne({
                where: {
                    id: bannerDto.redirect_id,
                },
            });
            if (!collection) {
                this.logger.warn('collection redirect not found!');
                throw new common_1.NotFoundException({
                    statusCode: common_1.HttpStatus.NOT_FOUND,
                    message: ['redirect of collection not found!'],
                    error: 'Not Found',
                });
            }
        }
    }
    async createBanner(bannerDto) {
        await this.validateBannerRedirectTypes(bannerDto);
        try {
            const banner = this.bannerRepository.create({
                title: bannerDto.title,
                image_url: bannerDto.image_url,
                status: bannerDto.status,
                is_active: bannerDto.is_active,
                redirect_type: bannerDto.redirect_type,
                redirect_id: bannerDto.redirect_id,
            });
            this.logger.log('banner created successfully!');
            return await this.bannerRepository.save(banner);
        }
        catch (error) {
            this.logger.error('some error occurred while creating the banner!', error);
            throw new common_1.InternalServerErrorException({
                statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: [
                    'some error occurred while creating a banner, please try again!',
                ],
                error: 'Internal Server Error',
            });
        }
    }
    async getBannerById(id) {
        const banner = await this.bannerRepository.findOne({
            where: {
                id: id,
            },
        });
        if (!banner) {
            this.logger.error('banner not found!');
            throw new common_1.NotFoundException({
                statusCode: common_1.HttpStatus.NOT_FOUND,
                message: [`banner with ${id} not found`],
                error: 'Not Found',
            });
        }
        this.logger.log('banner fetched successfully!');
        return banner;
    }
    async getAllBanners() {
        try {
            const banners = await this.bannerRepository.find();
            const totalBanners = banners.length;
            this.logger.log('banners fetched successfully!');
            return {
                data: banners,
                total: totalBanners,
            };
        }
        catch (error) {
            this.logger.error('some error occurred while fetching the banners!', error);
            throw new common_1.InternalServerErrorException({
                statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: [
                    'some error occurred while fetching all banners, please try again!',
                ],
                error: 'Internal Server Error',
            });
        }
    }
    async updateBanner(id, bannerDto) {
        await this.validateBannerRedirectTypes(bannerDto);
        await this.getBannerById(id);
        try {
            await this.bannerRepository.update({ id }, {
                title: bannerDto.title,
                image_url: bannerDto.image_url,
                status: bannerDto.status,
                is_active: bannerDto.is_active,
                redirect_type: bannerDto.redirect_type,
                redirect_id: bannerDto.redirect_id,
            });
            this.logger.log('banner has been updated!');
            return await this.bannerRepository.findOne({
                where: { id },
            });
        }
        catch (error) {
            this.logger.error('some error occurred while updating the banner!', error);
            throw new common_1.InternalServerErrorException({
                statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: [
                    'some error occurred while updating a banner, please try again!',
                ],
                error: 'Internal Server Error',
            });
        }
    }
    async deleteBanner(id) {
        await this.getBannerById(id);
        try {
            await this.bannerRepository.delete(id);
            this.logger.log('banner has been deleted!');
            return {
                id: `${id}`,
                message: 'banner deleted successfully!',
            };
        }
        catch (error) {
            this.logger.error('some error occurred while deleting the banner!', error);
            throw new common_1.InternalServerErrorException({
                statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: [
                    'some error occurred while deleting a banner, please try again!',
                ],
                error: 'Internal Server Error',
            });
        }
    }
};
exports.BannerService = BannerService;
exports.BannerService = BannerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(banner_entity_1.Banner)),
    __param(1, (0, typeorm_1.InjectRepository)(category_entity_1.Category)),
    __param(2, (0, typeorm_1.InjectRepository)(collection_entity_1.Collection)),
    __param(3, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __metadata("design:paramtypes", [banner_repository_1.BannerRepository,
        category_repository_1.CategoryRepository,
        collection_repository_1.CollectionRepository,
        product_repository_1.ProductRepository,
        common_1.Logger])
], BannerService);
//# sourceMappingURL=banners.service.js.map